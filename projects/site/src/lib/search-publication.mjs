import {validateSearchSelection,candidateRobots,searchSitemap,candidateCrawlers} from './search-launch.mjs';
const same=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
export function publicationPlan(policy,selection,routes,decisions=[]){
 const proposed=validateSearchSelection(selection,routes);
 if(policy?.version!==1||!['preview','limited','withdrawn'].includes(policy.mode)||!Array.isArray(policy.routes)||!same(policy.routes,proposed))throw Error('Publication search scope must match the reviewed proposal');
 if(policy.mode!=='preview'){
  const decision=decisions.find(d=>d.id===policy.approval);
  if(!decision||decision.status!=='approved'||decision.actor?.kind!=='human'||decision.actor.name!=='Ahimanikya Satapathy'||!Array.isArray(decision.search_routes)||!same(decision.search_routes,policy.routes))throw Error('An explicit Founder decision for these search routes is required');
 }
 return {mode:policy.mode,indexable:policy.mode==='limited'?policy.routes:[],approval:policy.approval};
}
export function publicationPage(html,route,plan){
 // Validate the baseline even when making an unchanged preview copy.
 const result=candidateRobots(html,plan.indexable.includes(route));
 return plan.mode==='preview'?html:result;
}
export function publicationCrawlerFiles(plan){
 return plan.mode==='preview'?{robots:'User-agent: *\nDisallow: /\n',sitemap:null}:plan.mode==='limited'?{robots:candidateCrawlers,sitemap:searchSitemap(plan.indexable)}:{robots:'User-agent: *\nAllow: /\n',sitemap:null};
}
