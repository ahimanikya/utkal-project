import {readFile,cp,mkdir} from 'node:fs/promises';
const system=new URL('../../design-system/',import.meta.url);
const pkg=JSON.parse(await readFile(new URL('package.json',system),'utf8'));
const tokens=JSON.parse(await readFile(new URL('tokens.json',system),'utf8'));
if(pkg.version!==tokens.version)throw new Error('Design system version mismatch');
const out=new URL('../public/fonts/utkal/',import.meta.url);await mkdir(out,{recursive:true});
for(const name of ['CormorantGaramond-OFL.txt','SourceSerif4-OFL.txt','NotoSerifOriya-OFL.txt'])await cp(new URL('fonts/'+name,system),new URL(name,out));
console.log(`Prepared Utkal Design System ${pkg.version} and font licences.`);
