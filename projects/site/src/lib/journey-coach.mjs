import {validateJourney,groupItems,dayLabel} from './journey.mjs';
import {setDayNote} from './day-planner.mjs';

export const DAY_OUTLINE='My day outline\nMain experience:\nTravel, arrival & return:\nA meal to make time for:\nA pause:\nStill to confirm:';
export function addDayOutline(value,day){
 const plan=validateJourney(value);
 if(!Number.isInteger(day)||day<1||day>30)throw Error('Choose a day from 1 to 30.');
 const note=(plan.dayNotes||[]).find(n=>n.day===day)||{title:'',notes:''};
 if(note.notes.includes('My day outline'))return plan;
 const notes=note.notes+(note.notes?'\n\n':'')+DAY_OUTLINE;
 if(notes.length>2000)throw Error('There is not enough room for the outline. Your notes were kept; shorten them or add your own headings.');
 return setDayNote(plan,day,note.title,notes);
}
export function journeyDayCards(value,entries,{includePersonalNotes=true}={}){
 const plan=validateJourney(value),catalog=new Map(entries.map(e=>[e.id,e]));
 return groupItems(plan).map(g=>({day:g.day,label:dayLabel(plan,g.day),count:g.items.length,
  title:includePersonalNotes?(plan.dayNotes||[]).find(n=>n.day===g.day)?.title||'':'',
  ideas:g.items.slice(0,3).map(i=>catalog.get(i.id)?.title||'Unavailable idea: '+i.id),more:Math.max(0,g.items.length-3)}));
}
export function journeyNextStep(value){
 const plan=validateJourney(value),days=groupItems(plan).filter(g=>g.day>0),later=plan.items.filter(i=>i.day===0).length,open=(plan.reminders||[]).filter(r=>!r.done).length;
 if(!plan.items.length&&!days.length)return {title:'Begin with something that draws you here.',text:'Choose a trail or save a place, a meal or a story. Dates can wait.',href:'/journey-starters/#find-your-trail',label:'Find a starting point'};
 if(!days.length)return {title:'Give your first day an anchor.',text:'Choose one saved idea to build around. Use its day selector below, then leave room for travel and a pause.',href:'#journey-day-0',label:'Choose from your saved ideas'};
 if(later)return {title:'Decide what belongs in this journey.',text:`${later} ${later===1?'idea is':'ideas are'} still for later. Give the ones you want a day, or leave them there while you explore.`,href:'#journey-day-0',label:'Review ideas for later'};
 if(open)return {title:'Bring the open questions into view.',text:`${open} personal ${open===1?'reminder is':'reminders are'} still to check. Use them for calls and conversations before setting out.`,href:'#personal-reminders',label:'Review things to confirm'};
 return {title:'Read the day as a whole.',text:'Look at travel, meals and pauses, then choose the days and notes to include in your book. Ticks record your progress; they do not verify arrangements.',href:'#take-journey',label:'Prepare your tour book'};
}
