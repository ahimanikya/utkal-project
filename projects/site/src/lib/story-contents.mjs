import {revealFragment,focusFragment} from './fragment-navigation.mjs';
export function bindStoryContents(details,doc){
 details.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&details.open){details.open=false;details.querySelector('summary')?.focus();event.preventDefault();}
 });
 for(const link of details.querySelectorAll('a[href^="#"]'))link.addEventListener('click',event=>{
  if(!details.open||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
  const result=revealFragment(link.getAttribute('href'),doc);
  if(!result)return;
  details.open=false;
  focusFragment(result.target);
  // Keep the native anchor navigation, URL fragment and reduced-motion behaviour.
 });
}
