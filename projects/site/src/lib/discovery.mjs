// Keep Odia vowel signs and other meaningful combining marks intact.
export function normaliseSearch(value){return String(value).normalize('NFKC').toLocaleLowerCase().replace(/[À-ž]/g,c=>c.normalize('NFD').replace(/[\u0300-\u036f]/g,'' )).replace(/[\p{P}\p{Z}\s]+/gu,' ').trim();}
export function matchesDiscovery(entry,{q='',topic='All',region='All'}={}){
 const haystack=normaliseSearch([entry.label,entry.dek,entry.category,...(entry.regions||[]),...(entry.aliases||[])].join(' '));
 return (topic==='All'||entry.category===topic)&&(region==='All'||(entry.regions||[]).includes(region))&&normaliseSearch(q).split(/\s+/).every(word=>haystack.includes(word));
}
export function sortDiscoveries(entries,sort='collection'){
 return sort==='title'?[...entries].sort((a,b)=>a.label.localeCompare(b.label,'en')||a.href.localeCompare(b.href)):[...entries];
}
export function discoveryQuery({q='',topic='All',region='All',sort='collection'}){
 const params=new URLSearchParams();if(q.trim())params.set('q',q.trim());if(topic!=='All')params.set('topic',topic);if(region!=='All')params.set('region',region);if(sort==='title')params.set('sort',sort);return params.toString();
}
