export function normaliseInterest(value,allowed){return allowed.includes(value)?value:'all';}
export function matchingTrails(trails,interest){return trails.filter(t=>interest==='all'||t.interests.includes(interest));}

// Optional enhancement: without JavaScript every comparison and story link remains visible.
export function mountTrailFinder(root,environment){
 const buttons=[...root.querySelectorAll('[data-trail-interest]')];
 const cards=[...root.querySelectorAll('[data-trail-card]')];
 const status=root.querySelector('[data-trail-count]');
 const allowed=buttons.map(b=>b.dataset.trailInterest);
 const entries=cards.map(card=>({card,interests:card.dataset.interests.split(' ')}));
 function apply(interest){
  const matches=new Set(matchingTrails(entries,interest).map(e=>e.card));
  for(const card of cards)card.hidden=!matches.has(card);
  for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.trailInterest===interest));
  const label=buttons.find(b=>b.dataset.trailInterest===interest)?.textContent.trim()||'All interests';
  status.textContent=`${matches.size} of ${cards.length} trails · ${label}`;
 }
 function render(){apply(normaliseInterest(new URL(environment.location.href).searchParams.get('interest'),allowed));}
 for(const button of buttons){
  button.addEventListener('click',()=>{
   const interest=normaliseInterest(button.dataset.trailInterest,allowed);
   const url=new URL(environment.location.href);
   if(interest==='all')url.searchParams.delete('interest');else url.searchParams.set('interest',interest);
   if(url.href!==environment.location.href){
    // Filtering still works if this browser disallows history changes.
    try{environment.history.pushState(null,'',url.href);}catch{apply(interest);return;}
   }
   render();
  });
  button.disabled=false;
 }
 environment.addEventListener('popstate',render);
 render();
}
