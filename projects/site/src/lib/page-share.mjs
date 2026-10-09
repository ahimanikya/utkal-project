import {boundedQuery} from './search.mjs';
import {discoveryQuery} from './discovery.mjs';

// Only Explore's rendered controls may contribute query values. Never forward
// arbitrary URL parameters, fragments, contribution drafts or journey data.
export function pageShareURL(location, {q='',topic='All',region='All',sort='collection'}={}, {topics=[],regions=[]}={}) {
 const url=new URL(location.pathname,location.origin);
 if(url.pathname==='/explore/')url.search=discoveryQuery({
  q:boundedQuery(q),
  topic:topics.includes(topic)?topic:'All',
  region:regions.includes(region)?region:'All',
  sort:sort==='title'?'title':'collection'
 });
 return url.href;
}
