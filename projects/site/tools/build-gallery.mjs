import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const kb=new URL('../../../kb/collections/bhubaneswar-fresco/',import.meta.url);
const rows=JSON.parse(readFileSync(new URL('catalog.json',kb),'utf8'));
const connections=JSON.parse(readFileSync(new URL('cultural-connections.json',kb),'utf8'));
const encode=value=>JSON.stringify(value).replaceAll('<','\\u003c');
let html=readFileSync(new URL('../src/gallery/fresco-template.html',import.meta.url),'utf8').replace('__CATALOG__',encode(rows)).replace('__CONNECTIONS__',encode(connections));
if(html.includes('__CATALOG__')||html.includes('__CONNECTIONS__'))throw Error('Gallery placeholders remain');
writeFileSync(new URL('../src/gallery/fresco.generated.html',import.meta.url),html);
console.log('Prepared '+rows.length+' credited art photographs; source originals unchanged.');
