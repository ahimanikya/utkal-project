import {journeyCatalog} from './journey-catalog';
import {detailRecords,detailUrl,detailPhoto} from './destination-details';
import regions from '../../../../kb/research/destinations/regions.json';
const copy={
 food:{kind:'Food',title:'Food & flavours',headline:'Leave room for',highlight:'one more taste.',lead:'Meet a dish, learn its story, then keep a meal idea for your journey.',note:'Dish and meal research, not a restaurant directory. Ask the person preparing your food about ingredients and your preferences.',questions:['Which dishes would I like to learn about?','What ingredients or dietary needs should I discuss?','Where will I confirm a suitable place to eat?']},
 'things-to-do':{kind:'Experience',title:'Things to do',headline:'A closer look.',highlight:'A richer visit.',lead:'A painted street, a carved surface, a moment by the water. Find something you want to spend time with.',note:'Ideas to research, not bookable activities. Confirm permission, timing and a suitable local contact before planning a visit.',questions:['What needs permission or advance arrangement?','Who can confirm whether an activity is available?','How much unplanned time do I want to leave?']},
 'stay-areas':{kind:'Stay area',title:'Where to base yourself',headline:'Choose a base.',highlight:'Find your own pace.',lead:'Begin with an area that suits the places you want to explore. Then research the individual stay and its facilities.',note:'Area guides only. No property here has been inspected or endorsed, and these pages do not provide availability or booking.',questions:['Does this base suit the places I want to visit?','Have I confirmed the room, facilities and access directly?','What are the payment, cancellation and arrival arrangements?']}
};
export const planningCollections=Object.entries(copy).map(([slug,content])=>({slug,...content,entries:journeyCatalog.filter(i=>i.kind===content.kind).map(item=>{
 const detail=detailRecords.find(r=>detailUrl(r.kind,r.slug)===item.href);
 const regionalItem=regions.regions.flatMap(r=>r.items).find(i=>i.id===item.id);
 return {...item,photoFit:regionalItem?.asset==='fakir'?'contain':'cover',photo:item.photo||(detail?detailPhoto(detail):regionalItem?.asset?regions.assets[regionalItem.asset]:null)};
})}));
