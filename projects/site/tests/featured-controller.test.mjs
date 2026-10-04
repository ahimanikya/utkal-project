import test from 'node:test';
import assert from 'node:assert/strict';
import {mountHomepageStories} from '../src/scripts/homepage-stories.mjs';
import {mountFeaturedStories} from '../src/scripts/featured-stories.mjs';
function fixture(storage){
 const pool=['place','taste','life'].flatMap(slot=>[0,1,2].map(i=>({href:`/${slot}/${i}/`,slot})));
 const sink=()=>({children:[],replaceChildren(...nodes){this.children=nodes;}});
 const cards=sink(),credits=sink(),status={textContent:''},button={hidden:true,addEventListener(type,fn){this.click=fn;}};
 const templates=pool.map(e=>({dataset:{storyTemplate:e.href},content:{querySelector(q){return {cloneNode(){return {href:e.href,kind:q,querySelector(){return {textContent:e.href+' ↗'};}};}};}}}));
 const root={dataset:{},ownerDocument:{querySelector(){return credits;}},querySelectorAll(){return templates;},querySelector(q){return {'[data-story-options]':{textContent:JSON.stringify({pool,pins:[],historyLimit:6})},'[data-story-display] .story-card-grid':cards,'[data-another-beginning]':button,'[data-story-status]':status}[q];}};
 return {root,pool,cards,credits,status,button,templates,options:{storage,random:()=>0,day:'2026-10-04'}};
}
test('initial selection is silent; manual discovery updates cards, matching credits and announcement',()=>{
 const h=fixture(null);mountFeaturedStories(h.root,h.options);
 assert.equal(h.cards.children.length,3);assert.equal(h.status.textContent,'');assert.equal(h.button.hidden,false);
 const first=h.cards.children.map(e=>e.href);h.button.click();
 const next=h.cards.children.map(e=>e.href);
 assert.ok(next.every(href=>!first.includes(href)));
 assert.deepEqual(h.credits.children.map(e=>e.href),next);
 assert.match(h.status.textContent,/Another beginning/);
});
test('blocked storage still allows manual freshness through in-memory history',()=>{
 const h=fixture({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}});
 mountFeaturedStories(h.root,h.options);const first=h.cards.children.map(e=>e.href);h.button.click();
 assert.ok(h.cards.children.every(e=>!first.includes(e.href)));
});
test('stored preferences avoid the previous visit and contain only bounded story paths',()=>{
 const storage={value:'["/place/0/","/taste/0/","/life/0/"]',getItem(){return this.value;},setItem(k,v){this.value=v;}};
 const h=fixture(storage);mountFeaturedStories(h.root,h.options);
 assert.ok(h.cards.children.every(e=>!e.href.endsWith('/0/')));
 assert.equal(JSON.parse(storage.value).length,6);
});
test('missing templates preserve the static trio and keep discovery button hidden',()=>{
 const h=fixture(null);h.templates.pop();mountFeaturedStories(h.root,h.options);
 assert.equal(h.cards.children.length,0);assert.equal(h.button.hidden,true);
});
test('reinitializing a mounted section never changes the visible stories',()=>{
 const h=fixture(null);mountFeaturedStories(h.root,h.options);const first=h.cards.children;
 mountFeaturedStories(h.root,h.options);assert.equal(h.cards.children,first);
});

test('homepage waits for the displayed artwork and connects cards to its theme without changing the image on refresh',async()=>{
 for(const fails of [false,true]){
  const h=fixture(null),query=h.root.querySelector;
  h.root.querySelector=q=>{
   const result=query(q);
   if(q==='[data-story-options]'){
    const options=JSON.parse(result.textContent);
    options.themes=[{theme:'Coast',preferred:['/place/1/']},{theme:'Weaving',preferred:['/life/2/']}];
    return {textContent:JSON.stringify(options)};
   }
   return result;
  };
  const caption={textContent:''};
  const scenes=['Coast','Weaving'].map((theme,i)=>({dataset:{key:`/${i}.webp`,title:theme,theme},hidden:i!==0,querySelector(){return {decode:async()=>{if(fails&&i===1)throw Error('unavailable');}};}}));
  const art={dataset:{},querySelectorAll:()=>scenes,querySelector:()=>caption};
  const doc={querySelector:()=>art,querySelectorAll:()=>[h.root]};
  await mountHomepageStories(doc,{artOptions:{storage:null,random:()=>0.9},storyOptions:h.options});
  assert.equal(art.dataset.theme,fails?'Coast':'Weaving');
  assert.ok(h.cards.children.some(e=>e.href===(fails?'/place/1/':'/life/2/')));
  const visibility=scenes.map(s=>s.hidden);h.button.click();
  assert.deepEqual(scenes.map(s=>s.hidden),visibility);
  assert.deepEqual(h.credits.children.map(e=>e.href),h.cards.children.map(e=>e.href));
 }
});
