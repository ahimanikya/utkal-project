import { readFileSync, writeFileSync } from 'node:fs';
const selected = [
  {slug:'chilika', path:'places/chilika.md', category:'Places', label:'Chilika', dek:'A beginning for understanding the coast through water, wildlife and local knowledge.', symbol:'01'},
  {slug:'konark', path:'places/konark.md', category:'Places', label:'Konark Sun Temple', dek:'Stone, light and a remarkable architectural inheritance.', symbol:'02'},
  {slug:'kotpad', path:'handlooms/kotpad.md', category:'Living culture', label:'Kotpad textiles', dek:'Following the threads of place, material and making.', symbol:'03'},
  {slug:'pakhala', path:'food/pakhala.md', category:'Food', label:'Pakhala', dek:'An everyday dish, and an invitation to listen to the people who make it.', symbol:'04'},
  {slug:'boita-bandana', path:'culture/boita-bandana.md', category:'Maritime connections', label:'Boita Bandana', dek:'Remembering journeys through the small act of setting a boat afloat.', symbol:'05'}
];
const entries=selected.map(item=>{
  const raw=readFileSync(new URL('../../../kb/research/'+item.path,import.meta.url),'utf8');
  const sources=JSON.parse(raw.match(/^sources: (.+)$/m)[1]);
  const body=raw.split('\n---\n')[1];
  const match=body.match(/## Sourced knowledge\s+([\s\S]*?)(?=\n##|$)/);
  const paragraph=(match?match[1]:body.split('\n\n')[1]).trim().replace(/\[\^[^\]]+\]/g,'');
  if(!paragraph||!sources.length)throw new Error('Incomplete selected content: '+item.path);
  return {...item,text:paragraph,sources,review:'Draft · editorial review pending',href:'/knowledge/'+item.slug+'/'};
});
writeFileSync(new URL('../src/data/selected.json',import.meta.url),JSON.stringify(entries,null,2)+'\n');
console.log('Prepared '+entries.length+' explicitly selected research notes; no automatic full-KB export.');
