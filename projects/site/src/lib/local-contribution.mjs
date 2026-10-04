export const localContributionPrompts={
 maker:{label:'Suggest a maker',kind:'Additional knowledge',page:'/visit/places/raghurajpur/',questions:['Which maker or workshop, and in which locality?','What do they make, and how do you know their work?','When did you visit or confirm the information?','Has the maker agreed to public identification? Link only public business details.'],evidence:'Dated first-hand observation or a public source; distinguish what you saw from what someone told you.'},
 access:{label:'Update visitor access',kind:'Correction',page:'/destinations/bhubaneswar/',questions:['Which exact site, entrance or service needs an update?','What did you observe, on which date?','Describe steps, seating, toilets or entry arrangements precisely.','Was this a one-day exception or a stated policy? What remains uncertain?'],evidence:'Observation date, exact location, public notice or source role. Do not generalise one entrance or one visit to the whole place.'},
 food:{label:'Share local food knowledge',kind:'Additional knowledge',page:'/food/bhubaneswar/',questions:['Name the dish, local variation and place.','What ingredients, preparation or cultural context should we understand?','Is this your own experience, a family recollection or a published account?','When was it observed? If recommending a kitchen, disclose any connection to it.'],evidence:'Public source or dated first-hand context. A past meal is not proof of today’s menu, allergen handling or availability.'}
};
export function localContributionURL(kind,page){
 if(!Object.hasOwn(localContributionPrompts,kind))throw Error('Unknown local contribution type');
 const prompt=localContributionPrompts[kind];
 return '/contribute/?'+new URLSearchParams({local:kind,page:page||prompt.page})+'#correction-draft';
}
