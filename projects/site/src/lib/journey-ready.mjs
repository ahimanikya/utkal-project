import {validateJourney,groupItems,dayLabel} from './journey.mjs';

export function addReminder(value,id,text){
 const plan=validateJourney(value);
 if((plan.reminders||[]).some(r=>r.id===id))throw Error('This reminder is already in your journey. Your wording and tick were kept.');
 return validateJourney({...plan,reminders:[...(plan.reminders||[]),{id,text:text.trim(),done:false}]});
}
export function editReminder(value,id,text,done){
 const plan=validateJourney(value);
 if(!(plan.reminders||[]).some(r=>r.id===id))throw Error('That reminder is no longer in this journey.');
 return validateJourney({...plan,reminders:plan.reminders.map(r=>r.id===id?{...r,text,done}:r)});
}
export function removeReminder(value,id){
 const plan=validateJourney(value),index=(plan.reminders||[]).findIndex(r=>r.id===id);
 if(index<0)throw Error('That reminder is no longer in this journey.');
 return {plan:{...plan,reminders:plan.reminders.filter(r=>r.id!==id)},undo:{reminder:plan.reminders[index],index}};
}
export function restoreReminder(value,undo){
 const plan=validateJourney(value);
 if(!undo||!Number.isInteger(undo.index)||undo.index<0)throw Error('No removed reminder is available.');
 if((plan.reminders||[]).some(r=>r.id===undo.reminder?.id))throw Error('That reminder is already back. Your current wording was kept.');
 const reminders=[...(plan.reminders||[])];reminders.splice(Math.min(undo.index,reminders.length),0,undo.reminder);
 return validateJourney({...plan,reminders});
}
export function questionGroups(value,entries){
 const plan=validateJourney(value),catalog=new Map(entries.map(e=>[e.id,e]));
 return plan.items.map(i=>catalog.get(i.id)).filter(e=>e?.visitQuestions?.length).map(e=>({id:e.id,title:e.title,href:e.href,questions:e.visitQuestions}));
}
export function readinessSummary(value,entries){
 const plan=validateJourney(value),catalog=new Set(entries.map(e=>e.id)),groups=groupItems(plan),reminders=plan.reminders||[];
 return {days:groups.filter(g=>g.day>0).length,later:plan.items.filter(i=>i.day===0).length,unavailable:plan.items.filter(i=>!catalog.has(i.id)).length,reminders:reminders.length,done:reminders.filter(r=>r.done).length,open:reminders.filter(r=>!r.done).length,hasDate:!!plan.startDate};
}
export function selectBookPlan(value,scope='all'){
 const plan=validateJourney(value);if(scope==='all')return plan;
 if(!Number.isInteger(scope)||!groupItems(plan).some(g=>g.day===scope))throw Error('Choose a day that is still in your journey.');
 const suffix=' — '+dayLabel(plan,scope);
 return validateJourney({...plan,title:plan.title.slice(0,120-suffix.length)+suffix,items:plan.items.filter(i=>i.day===scope),...(plan.dayNotes?{dayNotes:plan.dayNotes.filter(n=>n.day===scope)}:{})});
}
// Import only previously absent ideas. Destination writing and day arrangements win.
// Imported private day notes and reminders remain available by adding the source as a separate trip.
export function mergeJourneyIdeas(destination,incoming){
 const target=validateJourney(destination),source=validateJourney(incoming),ids=new Set(target.items.map(i=>i.id));
 const additions=source.items.filter(i=>!ids.has(i.id));
 const plan=validateJourney({...target,items:[...target.items,...additions.map(i=>({...i,day:0}))]});
 return {plan,added:additions.length,kept:source.items.length-additions.length,sourceDayNotes:(source.dayNotes||[]).length,sourceReminders:(source.reminders||[]).length};
}
export function importIdeasPreview(destination,incoming){
 const result=mergeJourneyIdeas(destination,incoming);
 return {added:result.added,kept:result.kept,sourceDayNotes:result.sourceDayNotes,sourceReminders:result.sourceReminders};
}
