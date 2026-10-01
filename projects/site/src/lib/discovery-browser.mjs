import {boundedQuery} from './search.mjs';
import {matchesDiscovery, discoveryQuery, sortDiscoveries} from './discovery.mjs';

// Keep the server-rendered collection usable when scripting is unavailable.
export function bindDiscovery(doc=document, win=window) {
 const input=doc.querySelector('#search'), region=doc.querySelector('#region'), sort=doc.querySelector('#sort');
 const results=doc.querySelector('#results'), count=doc.querySelector('#result-count');
 const topics=[...doc.querySelectorAll('[data-topic]')];
 const removals=[...doc.querySelectorAll('[data-remove-filter]')];
 const cards=[...results.querySelectorAll('article')].map(card=>({card,...JSON.parse(card.dataset.entry),href:card.querySelector('a').getAttribute('href')}));
 let topic='All', renderedSort='collection', typing=false, composing=false;
 const state=()=>({q:boundedQuery(input.value),topic,region:region.value,sort:sort.value});
 function readURL() {
  const p=new URLSearchParams(win.location.search);
  input.value=boundedQuery(p.get('q'));
  sort.value=p.get('sort')==='title'?'title':'collection';
  topic=topics.some(t=>t.dataset.topic===p.get('topic'))?p.get('topic'):'All';
  region.value=[...region.options].some(o=>o.value===p.get('region'))?p.get('region'):'All';
 }
 function render() {
  const current=state();
  // Typing and filtering should not detach and reinsert every photograph.
  if(renderedSort!==current.sort) {
   for(const row of sortDiscoveries(cards,current.sort))results.append(row.card);
   renderedSort=current.sort;
  }
  let found=0;
  for(const row of cards){row.card.hidden=!matchesDiscovery(row,current);if(!row.card.hidden)found++;}
  for(const link of topics) {
   const choice={...current,topic:link.dataset.topic};
   const available=cards.filter(row=>matchesDiscovery(row,choice)).length;
   link.querySelector('[data-topic-count]').textContent=`(${available})`;
   if(choice.topic===topic)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
   const q=discoveryQuery(choice);link.href='/explore/'+(q?'?'+q:'');
  }
  const context=[topic!=='All'?topic:'',current.region!=='All'?current.region:'',current.q.trim()?`“${current.q.trim()}”`:''].filter(Boolean);
  count.textContent=`${found} ${found===1?'entry':'entries'} found${context.length?' · '+context.join(' · '):''}`;
  doc.querySelector('#empty-results').hidden=found>0;
  for(const button of removals) {
   const key=button.dataset.removeFilter,value=current[key];
   button.hidden=key==='q'?!value.trim():value==='All';
   button.textContent=key==='q'?'Remove search':`Remove ${key==='topic'?'topic':'area'}: ${value}`;
  }
  doc.querySelector('#active-filters').hidden=removals.every(button=>button.hidden);
 }
 function update(mode='choice') {
  const query=discoveryQuery(state());
  const url=win.location.pathname+(query?'?'+query:'')+win.location.hash;
  const previous=win.location.pathname+win.location.search+win.location.hash;
  if(url!==previous) {
   const method=mode==='typing'&&typing?'replaceState':'pushState';
   win.history[method](win.history.state,'',url);
   if(mode==='typing')typing=true;
  }
  if(mode!=='typing')typing=false;
  render();
 }
 function plainClick(e){return !e.defaultPrevented&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&(e.button===undefined||e.button===0);}
 readURL();render();
 input.addEventListener('compositionstart',()=>{composing=true;});
 input.addEventListener('compositionend',()=>{composing=false;update('typing');});
 input.addEventListener('input',e=>{if(!composing&&!e.isComposing)update('typing');});
 // Returning to the search box starts a new reversible search, not an edit to an old visit.
 input.addEventListener('blur',()=>{typing=false;});
 region.addEventListener('change',()=>update());
 sort.addEventListener('change',()=>update());
 doc.querySelector('#search-form').addEventListener('submit',e=>{e.preventDefault();if(composing)return;update();count.focus();});
 topics.forEach(link=>link.addEventListener('click',e=>{
  if(!plainClick(e))return;e.preventDefault();topic=link.dataset.topic;update();
 }));
 removals.forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.removeFilter;
  if(key==='q')input.value='';else if(key==='topic')topic='All';else region.value='All';
  update();(key==='q'?input:key==='region'?region:topics[0]).focus();
 }));
 doc.querySelector('#clear-filters').addEventListener('click',e=>{
  if(!plainClick(e))return;e.preventDefault();input.value='';region.value='All';sort.value='collection';topic='All';update();input.focus();
 });
 win.addEventListener('popstate',()=>{typing=false;composing=false;readURL();render();});
}
