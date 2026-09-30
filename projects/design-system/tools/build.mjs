import {readFile,writeFile,mkdir} from 'node:fs/promises';
const t=JSON.parse(await readFile(new URL('../tokens.json',import.meta.url),'utf8'));
const rows=[];for(const [group,values] of Object.entries(t))if(values&&typeof values==='object')for(const [key,value] of Object.entries(values))rows.push(`  --uds-${group==='semantic'?'colour':group}-${key}: ${group==='semantic'?`var(--uds-colour-${value})`:group==='space'?value/16+'rem':value};`);
await mkdir(new URL('../styles/',import.meta.url),{recursive:true});await writeFile(new URL('../styles/tokens.css',import.meta.url),'/* Generated from tokens.json. Utkal Design System '+t.version+' */\n:root {\n'+rows.join('\n')+'\n}\n');console.log('Generated Utkal '+t.version+' tokens.');
