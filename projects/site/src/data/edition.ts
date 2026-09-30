import scope from '../../editions/coast.json';
export const isCoastalEdition=import.meta.env.PUBLIC_UTKAL_EDITION==='coast';
export const editionRoutes=new Set(scope.routes);
export const allowsPage=(href:string)=>{
 if(!isCoastalEdition)return true;
 const [base,fragment]=href.split('#'),path=base.split('?')[0];
 return editionRoutes.has(path)&&(path!=='/journey-starters/'||!fragment||scope.starter_ids.includes(fragment));
};
export const allowsIdea=(id:string)=>!isCoastalEdition||scope.journey_ids.includes(id);
export const allowsStarter=(id:string)=>!isCoastalEdition||scope.starter_ids.includes(id);
export const ideaHref=(id:string,href:string)=>isCoastalEdition?(scope.href_overrides[id]||href):href;
