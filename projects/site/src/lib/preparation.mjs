import prompts from '../../../../kb/research/journey-checklist.json' with {type:'json'};
import {validateJourney} from './journey.mjs';
export function preparationRows(value){
 const plan=validateJourney(value),marked=new Set(plan.checklist||[]),known=new Set(prompts.items.map(i=>i.id));
 return [...prompts.items.map(i=>({...i,done:marked.has(i.id)})),...[...marked].filter(id=>!known.has(id)).map(id=>({id,label:'Saved checklist item: '+id,done:true}))];
}
