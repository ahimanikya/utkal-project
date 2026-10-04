import {chooseStoryTrio,cleanStoryHistory} from '../lib/featured-selection.mjs';
const historyKey='utkal:story-beginnings:recent';
function localStorageOrNull(){try{return window.localStorage;}catch{return null;}}
export function mountFeaturedStories(root,{storage=localStorageOrNull(),random=Math.random,day,theme}={}){
  if(root.dataset.ready)return;
  const options=JSON.parse(root.querySelector('[data-story-options]').textContent);
  const cards=root.querySelector('[data-story-display] .story-card-grid');
  const credits=root.ownerDocument.querySelector('[data-featured-credits]');
  const button=root.querySelector('[data-another-beginning]');
  const status=root.querySelector('[data-story-status]');
  const templates=new Map([...root.querySelectorAll('[data-story-template]')].map(t=>[t.dataset.storyTemplate,t]));
  // Keep the server-rendered trio if any client resource is missing.
  if(!cards || !credits || options.pool.some(e=>!templates.get(e.href)?.content.querySelector('article') || !templates.get(e.href)?.content.querySelector('[data-story-credit]')))return;
  let history=[];
  try{history=cleanStoryHistory(JSON.parse(storage?.getItem(historyKey)||'[]'),options.pool,options.historyLimit);}catch{}
  function show(manual){
    const preferred=options.themes?.find(item=>item.theme===theme)?.preferred||[];
    const trio=chooseStoryTrio(options.pool,{pins:options.pins,history,random,day,preferred});
    const nextCards=trio.map(e=>templates.get(e.href).content.querySelector('article').cloneNode(true));
    const nextCredits=trio.map(e=>templates.get(e.href).content.querySelector('[data-story-credit]').cloneNode(true));
    cards.replaceChildren(...nextCards);
    credits.replaceChildren(...nextCredits);
    history=cleanStoryHistory([...trio.map(e=>e.href),...history],options.pool,options.historyLimit);
    try{storage?.setItem(historyKey,JSON.stringify(history));}catch{}
    if(manual)status.textContent='Another beginning: '+trio.map(e=>nextCards[trio.indexOf(e)].querySelector('h3').textContent.replace('↗','').trim()).join(' · ')+'.';
  }
  show(false);
  button.addEventListener('click',()=>show(true));
  button.hidden=false;
  root.dataset.ready='true';
}
