import details from '../../../../kb/research/destinations/details.json';
import chilika from '../../../../kb/research/destinations/chilika.json';
import konark from '../../../../kb/research/destinations/konark.json';
import chilikaStory from '../../../../kb/research/stories/narratives/chilika.json';
import konarkStory from '../../../../kb/research/stories/narratives/konark.json';
import notes from './selected.json';
export const pilots={chilika:{destination:chilika,story:chilikaStory},konark:{destination:konark,story:konarkStory}};
export const detailRecords=details.records;
export const detailUrl=(kind:string,slug:string)=>`/visit/${kind}/${slug}/`;
export function detailPhoto(record){const p=pilots[record.parent];return record.photo_ref==='hero'?{...p.story.image,caption:record.photo_context}:{...p.destination.visuals[record.photo_ref],caption:record.photo_context};}
export function detailSources(record){const p=pilots[record.parent];return [...notes.find(n=>n.slug===record.parent).sources,...p.destination.sources,...p.story.sources].filter(s=>record.sources.includes(s.id));}
export function relatedDetail(key){if(key.startsWith('knowledge/'))return {title:'Explore '+key.split('/')[1],href:'/'+key+'/'};const [kind,slug]=key.split('/');const d=detailRecords.find(d=>d.kind===kind&&d.slug===slug);return d?{title:d.title,href:detailUrl(kind,slug)}:null;}
