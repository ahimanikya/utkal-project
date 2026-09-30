import {validateJourney,validateLibrary,groupItems} from './journey.mjs';

const validDay=day=>Number.isInteger(day)&&day>=1&&day<=30;
export function setDayNote(value,day,title,notes){
 const plan=validateJourney(value);if(!validDay(day))throw Error('Choose a day from 1 to 30.');
 return validateJourney({...plan,dayNotes:[...(plan.dayNotes||[]).filter(n=>n.day!==day),{day,title,notes}].sort((a,b)=>a.day-b.day)});
}
export function addPlanningDay(value){
 const plan=validateJourney(value),used=new Set(groupItems(plan).map(g=>g.day));
 const day=Array.from({length:30},(_,i)=>i+1).find(d=>!used.has(d));
 if(!day)throw Error('All 30 days are already in your plan.');
 return {plan:setDayNote(plan,day,'',''),day};
}
export function moveDayIdeas(value,from,to){
 const plan=validateJourney(value);
 if(!Number.isInteger(from)||from<0||from>30||!Number.isInteger(to)||to<0||to>30||from===to)throw Error('Choose a different day, or Ideas for later.');
 const moving=plan.items.filter(i=>i.day===from);if(!moving.length)throw Error('There are no ideas to move from this day.');
 // Append after the destination’s existing ideas; private day notes remain on their day.
 return validateJourney({...plan,items:[...plan.items.filter(i=>i.day!==from),...moving.map(i=>({...i,day:to}))]});
}
export function shiftPlannedDays(value,offset){
 const plan=validateJourney(value);
 if(!Number.isInteger(offset)||offset===0||Math.abs(offset)>29)throw Error('Choose a whole-day shift from −29 to 29, excluding zero.');
 const groups=groupItems(plan).filter(g=>g.day>0);if(!groups.length)throw Error('Add a planned day before shifting it.');
 if(groups.some(g=>!validDay(g.day+offset)))throw Error('That shift would move a planned day outside days 1–30. Nothing changed.');
 return validateJourney({...plan,items:plan.items.map(i=>({...i,day:i.day?i.day+offset:0})),...(plan.dayNotes?{dayNotes:plan.dayNotes.map(n=>({...n,day:n.day+offset}))}:{})});
}
export function dayChangeUndo(before,after){return {before:validateJourney(before),after:JSON.stringify(validateJourney(after))};}
export function undoDayChange(value,undo){
 const current=validateJourney(value);
 if(!undo||JSON.stringify(current)!==undo.after)throw Error('The journey changed after that arrangement. Your newer edits have been kept.');
 return validateJourney(undo.before);
}
export function copyIdea(library,sourceId,targetId,itemId){
 const next=validateLibrary(library),source=next.trips.find(t=>t.id===sourceId),target=next.trips.find(t=>t.id===targetId);
 if(!source||!target||sourceId===targetId)throw Error('Choose a different existing journey.');
 const item=source.plan.items.find(i=>i.id===itemId);if(!item)throw Error('Choose an idea still in this journey.');
 if(target.plan.items.some(i=>i.id===itemId))throw Error('That journey already has this idea. Its notes were kept.');
 target.plan.items.push({...item,day:0});return validateLibrary(next);
}
export const hasJourneyContent=plan=>plan.items.length>0||(plan.dayNotes||[]).length>0||(plan.reminders||[]).length>0;
export const visitPrompts=entry=>entry?.visitNotebook?[
 {heading:'Notice',text:entry.visitNotebook.notice},{heading:'Connect with care',text:entry.visitNotebook.connect},
 {heading:'Before you go',text:entry.visitNotebook.prepare},{heading:'Leave room for',text:entry.visitNotebook.pair.text},
 {heading:'Bring home a memory',text:entry.visitNotebook.remember}
]:[];
