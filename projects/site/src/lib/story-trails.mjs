/** Resolve only curated stories. Imported plans carry an ID, never story text or image URLs. */
export function selectedStoryTrail(plan,trails=[]){
 const trail=trails.find(t=>t.starter_id===plan.storyTrail);
 if(!trail)return null;
 const selected=new Set(plan.items.map(i=>i.id));
 const chapters=trail.chapters.filter(c=>c.ideas.some(id=>selected.has(id))).map(c=>({...c,selectedIdeas:c.ideas.filter(id=>selected.has(id))}));
 return chapters.length?{...trail,chapters}:null;
}
export const storyTrailPhotos=(plan,trails=[])=>selectedStoryTrail(plan,trails)?.chapters.map(c=>c.photo).filter(Boolean)||[];
