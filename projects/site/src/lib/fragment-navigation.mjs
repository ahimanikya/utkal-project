// Resolve by ID rather than a selector: fragments may contain Odia or punctuation.
export function revealFragment(hash,doc){
 if(!hash||hash==='#')return null;
 let id;try{id=decodeURIComponent(hash.slice(1));}catch{return null;}
 const target=doc.getElementById(id);if(!target)return null;
 let opened=false;
 for(let parent=target;parent;parent=parent.parentElement){
  if(parent.tagName==='DETAILS'&&!parent.open){parent.open=true;opened=true;}
 }
 return {target,opened};
}
export function focusFragment(target){
 const focus=target.tagName==='DETAILS'?target.querySelector('summary'):target.querySelector('h2,h3')||target;
 if(!focus)return;
 const nativeControl=['SUMMARY','BUTTON','INPUT','SELECT','TEXTAREA'].includes(focus.tagName)||(focus.tagName==='A'&&focus.hasAttribute('href'));
 if(!nativeControl&&!focus.hasAttribute('tabindex'))focus.setAttribute('tabindex','-1');
 focus.focus({preventScroll:true});
}
export function bindFragmentNavigation(doc,win){
 const arrive=()=>{
  const result=revealFragment(win.location.hash,doc);
  // Scroll only when revealing content changes its layout. Never steal focus on arrival.
  if(result?.opened)result.target.scrollIntoView({behavior:'instant',block:'start'});
 };
 arrive();
 win.addEventListener('hashchange',arrive);
 doc.addEventListener('click',event=>{
  if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
  const link=event.target?.closest?.('a[href]');
  if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  let url;try{url=new URL(link.href,win.location.href);}catch{return;}
  const current=new URL(win.location.href);
  if(url.origin!==current.origin||url.pathname!==current.pathname||url.search!==current.search)return;
  const result=revealFragment(url.hash,doc);
  if(result?.opened)focusFragment(result.target);
  // Leave URL/history and the final scroll to native link navigation, including repeat clicks.
 });
}
