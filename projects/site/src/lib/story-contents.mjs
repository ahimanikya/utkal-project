export function bindStoryContents(details,doc){
 details.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&details.open){details.open=false;details.querySelector('summary')?.focus();event.preventDefault();}
 });
 for(const link of details.querySelectorAll('a[href^="#"]'))link.addEventListener('click',event=>{
  if(!details.open||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
  const id=link.getAttribute('href').slice(1);let target;try{target=doc.getElementById(decodeURIComponent(id));}catch{return;}
  if(!target)return;
  details.open=false;
  const focus=target.querySelector('h2,h3')||target;
  if(!focus.hasAttribute('tabindex'))focus.setAttribute('tabindex','-1');
  focus.focus({preventScroll:true});
  // Keep the native anchor navigation, URL fragment and reduced-motion behaviour.
 });
}
