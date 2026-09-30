import {addTrip,addItem,emptyJourney} from './journey.mjs';
/** Create an independent, unscheduled research collection; never mutate the input. */
export function createStarterTrip(library,tripId,starter,catalogIds){
 if(!starter||typeof starter.title!=='string'||!starter.title.trim()||!Array.isArray(starter.items)||!starter.items.length)throw new Error('This starter is unavailable. Choose another.');
 const known=new Set(catalogIds);
 if(new Set(starter.items).size!==starter.items.length||starter.items.some(id=>!known.has(id)))throw new Error('This starter needs an update. Your saved journeys are unchanged.');
 let plan={...emptyJourney(),title:starter.title};
 for(const id of starter.items)plan=addItem(plan,id);
 return addTrip(library,tripId,plan);
}
