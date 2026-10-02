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
  if(!match||!sources.length)throw new Error('Incomplete selected content: '+item.path);
  const sourceIds=new Set(sources.map(source=>source.id));
  if(sourceIds.size!==sources.length)throw new Error('Duplicate source ID: '+item.path);
  const paragraphs=match[1].trim().split(/\n\s*\n/).map(rawParagraph=>{
    const citations=[...new Set([...rawParagraph.matchAll(/\[\^([^\]]+)\]/g)].map(match=>match[1]))];
    if(!citations.length||citations.some(id=>!sourceIds.has(id)))throw new Error('Missing or unknown citation: '+item.path);
    return {text:rawParagraph.replace(/\[\^[^\]]+\]/g,'').replace(/\s*\n\s*/g,' ').trim(),sources:citations};
  });
  const text=paragraphs.map(paragraph=>paragraph.text).join('\n\n');
  const citedIds=new Set(paragraphs.flatMap(paragraph=>paragraph.sources));
  const publishedSources=sources.filter(source=>citedIds.has(source.id));
  return {...item,text,paragraphs,sources:publishedSources,review:'Draft · Founder review pending',href:'/knowledge/'+item.slug+'/'};
});
writeFileSync(new URL('../src/data/selected.json',import.meta.url),JSON.stringify(entries,null,2)+'\n');
console.log('Prepared '+entries.length+' explicitly selected research notes; no automatic full-KB export.');
