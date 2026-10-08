import {validateJourney} from './journey.mjs';

// Unknown or mixed ideas must never be treated as a reading-only collection.
export function isReadingCollection(value,entries=[]){
 const plan=validateJourney(value),catalog=new Map(entries.map(e=>[e.id,e]));
 return plan.items.length>0&&plan.items.every(item=>catalog.get(item.id)?.kind==='Reading');
}
export function journeyGuidance(value,entries=[]){
 const reading=isReadingCollection(value,entries);
 return {
  date:reading?'First reading day (optional)':'First travel day (optional)',
  plan:reading?'Read at your own pace. Keep ideas for later, or choose days for reading. Use the notes to remember a work, an edition or a question.':'Give each idea a day, or leave it for later. Move items within a day with ↑ and ↓. These are your choices, not a checked route or a booking.',
  outline:reading?'Dates are optional. If you add a day, its notebook offers a reading outline for the work, edition, passage and questions you want to keep.':'The day notebook offers an optional outline for a main experience, travel, a meal, a pause and things still to confirm.',
  preparationNav:reading?'2 · Notes & reminders':'2 · Before you go',
  preparationTitle:reading?'Keep a question beside you':'Before you go',
  preparationCopy:reading?'Record the edition or translation you want to find, or a question to return to. Personal reminders are yours to edit; dates are not required.':'Collect the questions that matter to your trip. A tick records your own progress.',
  checklist:reading?'Travel checklist · optional if you plan a visit':'Before you go · preparation checklist',
  takeaway:reading?'Carry your reading choices, questions and notes. Choose a lightweight text edition or a book with photographs.':'Carry your places, days, notes and preparation checklist. Choose a lightweight text edition or a book with photographs.',
  reminderPlaceholder:reading?'Find the translator and edition of the work I want to read':'Ask our host about the return pickup'
 };
}
