import test from 'node:test';
import assert from 'node:assert/strict';
import {bindDiscovery} from '../src/lib/discovery-browser.mjs';

// A small event/DOM harness exercises the production controller, not a second filter implementation.
function element(props={}) {
 const events={},attrs=new Map();
 return {hidden:false,textContent:'',value:'',dataset:{},focused:false,
  addEventListener:(name,fn)=>events[name]=fn,
  emit(name,extra={}){const e={preventDefault(){this.prevented=true;},...extra};events[name]?.(e);return e;},
  setAttribute:(k,v)=>attrs.set(k,v),removeAttribute:k=>attrs.delete(k),getAttribute:k=>attrs.get(k),
  focus(){this.focused=true;},...props};
}
function fixture(query='') {
 const rows=[
  {label:'Puri beach',category:'Places',regions:['Puri'],dek:'A shore',href:'/puri/'},
  {label:'Puri food',category:'Food',regions:['Puri'],dek:'A taste',href:'/food/'},
  {label:'Chilika',category:'Places',regions:['Chilika'],dek:'A lagoon',aliases:['ଚିଲିକା'],href:'/chilika/'},
  {label:'Chhena Poda',category:'Food',regions:['Nayagarh'],dek:'A taste',href:'/poda/'}
 ];
 const cards=rows.map(row=>element({dataset:{entry:JSON.stringify(row)},querySelector:()=>({getAttribute:()=>row.href})}));
 const topics=['All','Places','Food'].map(topic=>element({dataset:{topic},counter:element(),querySelector(){return this.counter;}}));
 const removals=['q','topic','region'].map(removeFilter=>element({dataset:{removeFilter}}));
 const input=element(),region=element({options:['All','Puri','Chilika','Nayagarh'].map(value=>({value}))}),sort=element();
 const results=element({order:[...cards],moves:0,querySelectorAll:()=>cards,append(card){this.moves++;this.order=this.order.filter(c=>c!==card);this.order.push(card);}});
 const nodes={'#search':input,'#region':region,'#sort':sort,'#results':results,'#result-count':element(),'#empty-results':element(),'#active-filters':element(),'#search-form':element(),'#clear-filters':element()};
 const doc={querySelector:q=>nodes[q],querySelectorAll:q=>q==='[data-topic]'?topics:removals};
 const history=['/explore/'+query];let index=0;const events={};
 const win={location:new URL(history[0],'https://example.test'),addEventListener:(name,fn)=>events[name]=fn};
 win.history={state:{otherFeature:'preserved'},pushState(s,t,url){assert.equal(s.otherFeature,'preserved');history.splice(++index);history.push(url);win.location=new URL(url,win.location);},replaceState(s,t,url){assert.equal(s.otherFeature,'preserved');history[index]=url;win.location=new URL(url,win.location);}};
 bindDiscovery(doc,win);
 return {nodes,input,region,sort,results,topics,removals,cards,win,history,
  visible:()=>cards.filter(c=>!c.hidden).map(c=>JSON.parse(c.dataset.entry).label),
  back(){if(index>0){win.location=new URL(history[--index],win.location);events.popstate();}},
  forward(){if(index<history.length-1){win.location=new URL(history[++index],win.location);events.popstate();}}
 };
}
test('deep links restore combined controls, zero results, count and removable filters',()=>{
 const f=fixture('?q=shore&topic=Food&region=Puri&sort=title');
 assert.equal(f.input.value,'shore');assert.equal(f.region.value,'Puri');assert.equal(f.sort.value,'title');
 assert.deepEqual(f.visible(),[]);assert.equal(f.nodes['#empty-results'].hidden,false);
 assert.match(f.nodes['#result-count'].textContent,/0 entries found · Food · Puri · “shore”/);
 assert.ok(f.removals.every(b=>!b.hidden));assert.equal(f.topics[1].counter.textContent,'(1)');
 assert.equal(f.history.length,1);assert.equal(f.topics[2].getAttribute('aria-current'),'true');
});
test('removing just the topic recovers results while preserving query, area and sort',()=>{
 const f=fixture('?q=shore&topic=Food&region=Puri&sort=title');f.removals[1].emit('click');
 assert.deepEqual(f.visible(),['Puri beach']);assert.equal(f.input.value,'shore');assert.equal(f.region.value,'Puri');assert.equal(f.sort.value,'title');
 assert.equal(f.removals[1].hidden,true);assert.ok(f.topics[0].focused);assert.equal(f.history.length,2);
 f.back();assert.deepEqual(f.visible(),[]);assert.equal(f.removals[1].hidden,false);
});
test('area, topic, sort and clear actions can each be undone and redone',()=>{
 const f=fixture();f.region.value='Puri';f.region.emit('change');f.topics[2].emit('click');f.sort.value='title';f.sort.emit('change');
 assert.equal(f.history.length,4);assert.deepEqual(f.visible(),['Puri food']);
 f.nodes['#clear-filters'].emit('click');assert.equal(f.visible().length,4);assert.ok(f.input.focused);
 f.back();assert.equal(f.sort.value,'title');assert.deepEqual(f.visible(),['Puri food']);
 f.back();assert.equal(f.sort.value,'collection');f.back();assert.deepEqual(f.visible(),['Puri beach','Puri food']);
 f.back();assert.equal(f.region.value,'All');f.forward();assert.equal(f.region.value,'Puri');
});
test('typing creates one reversible search rather than a history entry per letter',()=>{
 const f=fixture();for(const value of ['P','Pu','Puri']){f.input.value=value;f.input.emit('input');}
 assert.equal(f.history.length,2);assert.match(f.win.location.search,/q=Puri/);
 f.nodes['#search-form'].emit('submit');assert.equal(f.history.length,2);assert.ok(f.nodes['#result-count'].focused);
 f.input.value='Chilika';f.input.emit('input');assert.equal(f.history.length,3);
 f.back();assert.equal(f.input.value,'Puri');f.back();assert.equal(f.input.value,'');
 f.forward();assert.equal(f.input.value,'Puri');
});
test('unfinished composition does not filter or publish a partial Odia query',()=>{
 const f=fixture();f.input.emit('compositionstart');f.input.value='ଚି';f.input.emit('input',{isComposing:true});
 assert.equal(f.history.length,1);assert.equal(f.visible().length,4);
 f.input.value='ଚିଲିକା';f.input.emit('compositionend');f.input.emit('input');
 assert.deepEqual(f.visible(),['Chilika']);assert.equal(f.history.length,2);assert.equal(new URLSearchParams(f.win.location.search).get('q'),'ଚିଲିକା');
});
test('typing/filtering leaves photo nodes in place; sorting restores collection order',()=>{
 const f=fixture();f.input.value='Puri';f.input.emit('input');f.topics[2].emit('click');assert.equal(f.results.moves,0);
 f.sort.value='title';f.sort.emit('change');assert.equal(JSON.parse(f.results.order[0].dataset.entry).label,'Chhena Poda');
 f.sort.value='collection';f.sort.emit('change');assert.deepEqual(f.results.order,f.cards);
});
test('modified links stay native and generated topic URLs retain other choices',()=>{
 const f=fixture('?q=Puri&region=Puri&sort=title');
 for(const opts of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){
  assert.ok(!f.topics[2].emit('click',opts).prevented);assert.ok(!f.nodes['#clear-filters'].emit('click',opts).prevented);
 }
 assert.equal(f.history.length,1);const url=new URL(f.topics[2].href,'https://example.test');
 for(const [k,v] of Object.entries({q:'Puri',region:'Puri',sort:'title',topic:'Food'}))assert.equal(url.searchParams.get(k),v);
});
test('invalid URL choices fall back safely, query is bounded and labels use text',()=>{
 const f=fixture('?topic=unknown&region=unknown&sort=unknown&q='+encodeURIComponent('<img src=x onerror=alert(1)>'+('a'.repeat(210))));
 assert.equal(f.input.value.length,200);assert.equal(f.region.value,'All');assert.equal(f.sort.value,'collection');assert.equal(f.topics[0].getAttribute('aria-current'),'true');
 assert.match(f.nodes['#result-count'].textContent,/<img src=x/);assert.equal(f.removals[0].textContent,'Remove search');
});
test('single-filter removal returns focus to its corresponding control',()=>{
 for(const [key,i,control] of [['q',0,'input'],['region',2,'region']]){
  const f=fixture('?q=Puri&region=Puri&topic=Food');f.removals[i].emit('click');
  assert.ok(f[control].focused);assert.equal(new URLSearchParams(f.win.location.search).has(key),false);assert.equal(new URLSearchParams(f.win.location.search).get('topic'),'Food');
 }
});
