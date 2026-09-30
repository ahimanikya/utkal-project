import paths from './paths.json' with {type:'json'};
export const iconNames=Object.keys(paths);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function icon(name,{label='',className='utk-icon'}={}){if(!Object.hasOwn(paths,name))throw new Error('Unknown Utkal icon: '+name);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${escape(className)}" ${label?`role="img" aria-label="${escape(label)}"`:'aria-hidden="true"'} focusable="false">${paths[name]}</svg>`;}
