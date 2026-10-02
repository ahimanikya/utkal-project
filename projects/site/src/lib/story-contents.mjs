import {revealFragment,focusFragment} from './fragment-navigation.mjs';
export function bindStoryContents(details,doc){
 details.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&details.open){details.open=false;details.querySelector('summary')?.focus();event.preventDefault();}
 });
 for(const link of details.querySelectorAll('a[href^="#"]'))link.addEventListener('click',event=>{
  if(!details.open||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
  const result=revealFragment(link.getAttribute('href'),doc);
  if(!result)return;
  // Native fragment navigation focuses the target after the click handler.
  // Make that region focusable so it cannot reset keyboard focus to the body.
  if(!result.target.hasAttribute('tabindex'))result.target.setAttribute('tabindex','-1');
  details.open=false;
  focusFragment(result.target);
  // After native navigation, align against the closed menu's layout. This also
  // handles choosing the same fragment twice without losing the heading.
  doc.defaultView.requestAnimationFrame(()=>{
   result.target.scrollIntoView({behavior:'instant',block:'start'});
   focusFragment(result.target);
  });
  // Keep native URL/history updates and modified-click behaviour.
 });
}
