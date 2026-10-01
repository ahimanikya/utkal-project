const sections = [
 ['/languages/', 'Languages of Odisha'], ['/literature/', 'Odia literature'],
 ['/food/', 'Food & flavours'], ['/destinations/', 'Destinations'],
];
export function pageContext(path, title) {
 const section = (path === '/people/subhas-chandra-bose/' ? ['/destinations/cuttack/', 'Cuttack'] : null) || sections.find(([href]) => path.startsWith(href))
  || (path.startsWith('/people/') ? sections[1] : null)
  || (['/knowledge/chilika/', '/knowledge/konark/'].includes(path) ? sections[3] : null);
 if (!section) return [];
 return [{href:'/explore/',label:'Explore'}, ...(section[0] === path ? [] : [{href:section[0],label:section[1]}]), {href:path,label:title,current:true}];
}
// A page's existing, credited image is preferred. A script SVG is not converted
// into a social image, and a missing portrait never receives a substitute face.
export function sharingImage(image) {
 if (image?.src?.startsWith('/') && /\.(?:png|jpe?g|webp)$/i.test(image.src) && image.alt && image.width && image.height) return image;
 return {src:'/assets/coast-illustration-v1.webp',alt:'Utkal Project brand illustration: an imagined Odisha-inspired coast, not a documentary view of this subject.',width:1536,height:1024};
}
