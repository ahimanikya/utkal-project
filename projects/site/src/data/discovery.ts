import bose from '../../../../kb/research/people/subhas-chandra-bose.json';
import editionCopy from '../../../../kb/research/destinations/coastal-edition-copy.json';
import {allowsPage,isCoastalEdition} from './edition';
import chilikaStory from '../../../../kb/research/stories/narratives/chilika.json';
import konarkStory from '../../../../kb/research/stories/narratives/konark.json';
import aliases from '../../../../kb/research/discovery-aliases.json';
import notes from './selected.json';
import voices from '../../../../kb/research/voices/collection.json';
import regions from '../../../../kb/research/destinations/regions.json';
import coastalFood from '../../../../kb/research/food/puri-coast.json';
import cuttackFood from '../../../../kb/research/food/cuttack.json';
import cityFood from '../../../../kb/research/food/bhubaneswar.json';
import foods from '../../../../kb/research/food/collection.json';
import {detailRecords,detailUrl,detailPhoto} from './destination-details';
const locations={chilika:['Chilika'],konark:['Konark & Puri'],kotpad:['Koraput'],pakhala:['Across Odisha'],'boita-bandana':['Across Odisha']};
const voiceAreas={'languages/ho':['Mayurbhanj','Keonjhar','Angul'],'languages/juang':['Keonjhar','Angul','Dhenkanal'],'languages/koya':['Malkangiri'],'people/gangadhar-meher':['Bargarh'],'people/fakir-mohan-senapati':['Balasore'],'people/pratibha-ray':['Jagatsinghpur'],'people/bhima-bhoi':['Sambalpur & Subarnapur'],'people/gopinath-mohanty':['Cuttack','Koraput'],'languages/kui':['Kandhamal'],'languages/kuvi':['Rayagada'],'languages/saora':['Southern Odisha'],'languages/santali':['Mayurbhanj']};
const collectionEntries=[
 {label:'Languages by district',category:'Languages',dek:'Start with a place: compare Census 2011 mother tongues across all 30 districts and follow the stories behind the numbers.',href:'/languages/districts/',regions:['Across Odisha']},
 {label:'Multilingual Odisha',category:'Languages',dek:'A mother tongue is one question. Explore additional languages and the limits of population statistics.',href:'/languages/multilingual-odisha/',regions:['Across Odisha']},
 {label:'Languages of Odisha · population atlas',category:'Languages',dek:'Explore Census 2011 mother-tongue counts across 30 districts, with rural and urban comparisons.',href:'/languages/atlas/',image:voices.assets.manuscript,regions:['Across Odisha']},
 {label:bose.name,category:'People',dek:bose.lead,href:'/'+bose.path+'/',image:{...bose.assets[bose.hero],fit:'cover'},regions:[bose.area]},
 {label:coastalFood.title,category:'Food',dek:coastalFood.lead,href:'/food/puri-coast/',image:foods.assets[coastalFood.hero],regions:['Puri','Konark & Puri']},
 {label:cityFood.title,category:'Food',dek:cityFood.lead,href:'/food/bhubaneswar/',image:foods.assets[cityFood.hero],regions:['Bhubaneswar']},
 {label:cuttackFood.title,category:'Food',dek:cuttackFood.lead,href:'/food/cuttack/',image:foods.assets[cuttackFood.hero],regions:['Cuttack']},
 ...regions.regions.map(r=>({label:r.title,category:'Places',dek:r.orientation,href:`/destinations/${r.slug}/`,image:regions.assets[r.hero],regions:[r.title]})),
 ...detailRecords.map(r=>({label:r.title,category:r.kind==='places'?'Places':r.kind==='stays'?'Stay areas':'Experiences',dek:r.lead,href:detailUrl(r.kind,r.slug),image:detailPhoto(r),regions:[r.parent==='konark'?'Konark & Puri':r.parent==='chilika'?'Chilika':regions.regions.find(region=>region.slug===r.parent)?.title||'Across Odisha']})),
 {label:'Places, voices & stories',category:'Literature',dek:'Cultural reading trails through Chilika, Balasore and Mayurbhanj.',href:'/stories/culture-trails/',regions:['Chilika','Balasore','Mayurbhanj']},
 {label:'Samanta Chandrasekhar',category:'People',dek:'Pathani Samanta: an astronomer, his observations and the work he left behind.',href:'/people/samanta-chandrasekhar/',regions:['Across Odisha']},
 {label:'Bhubaneswar Fresco · Painted Streets',category:'Living culture',dek:'A photographic walk through Bhubaneswar in February 2009, by Ahimanikya Satapathy.',href:'/stories/bhubaneswar-fresco/',image:regions.assets['fresco-procession'],regions:['Bhubaneswar']},
 ...notes.map(n=>({...n,image:({chilika:chilikaStory.image,konark:konarkStory.image})[n.slug],regions:locations[n.slug]||['Across Odisha']})),
 ...voices.pages.map(p=>({label:p.title,category:p.path.startsWith('languages')?'Languages':p.path.startsWith('people')?'People':'Literature',dek:p.lead,href:'/'+p.path+'/',image:voices.assets[p.hero_asset],regions:voiceAreas[p.path]||['Across Odisha']})),
 ...foods.pages.map(p=>({label:p.title,category:'Food',dek:p.lead,href:'/food/'+p.slug+'/',image:foods.assets[p.hero],regions:p.regions||(p.slug==='mudhi-mansa'?['Mayurbhanj']:p.slug==='balasore'?['Balasore']:['Nayagarh','Across Odisha'])}))
];
export const discoveryEntries=collectionEntries.filter(e=>allowsPage(e.href)).map(e=>({...e,dek:isCoastalEdition&&e.href==='/destinations/bhubaneswar/'?editionCopy.bhubaneswar.orientation:e.dek,aliases:aliases.entries[e.href]||[]}));
export const discoveryTopics=isCoastalEdition?['All',...new Set(discoveryEntries.map(e=>e.category))]:['All','People','Places','Experiences','Stay areas','Living culture','Food','Maritime connections','Languages','Literature'];
export const discoveryRegions=['All',...new Set(discoveryEntries.flatMap(e=>e.regions))].sort((a,b)=>a==='All'?-1:b==='All'?1:a.localeCompare(b));
