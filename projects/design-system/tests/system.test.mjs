import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {icon,iconNames} from '../icons/index.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const tokens=JSON.parse(read('tokens.json'));
const lum=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
test('Utkal identity values and semantic links remain consistent',()=>{
 assert.deepEqual(Object.fromEntries(['sea','earth','olive','straw'].map(k=>[k,tokens.colour[k]])),{sea:'#1D4658',earth:'#91462F',olive:'#74633B',straw:'#C1A263'});
 for(const [role,value] of Object.entries(tokens.semantic))assert.ok(tokens.colour[value],role);
 const generated=read('styles/tokens.css');for(const [key,value] of Object.entries(tokens.colour))assert.ok(generated.includes(`--uds-colour-${key}: ${value}`));
});
test('text, actions and error roles meet normal-text contrast on their surfaces',()=>{
 for(const background of ['canvas','surface'])for(const foreground of ['ink','sea','earth','muted','danger'])assert.ok(contrast(tokens.colour[foreground],tokens.colour[background])>=4.5,foreground+' on '+background);
 assert.ok(contrast(tokens.colour['on-action'],tokens.colour.action||tokens.colour.sea)>=4.5);
});
test('icon labels are escaped and decorative icons stay out of the accessibility tree',()=>{
 for(const name of iconNames){assert.ok(icon(name).includes('aria-hidden="true"'));assert.ok(icon(name,{label:'Find & <search> "now"'}).includes('Find &amp; &lt;search&gt; &quot;now&quot;'));assert.ok(!icon(name).includes('<script'));}
 assert.throws(()=>icon('missing'));assert.throws(()=>icon('__proto__'));
});
test('font distributions retain author licences and package resources resolve',()=>{
 for(const [name,licence] of [['CormorantGaramond-Variable.ttf','CormorantGaramond-OFL.txt'],['SourceSerif4-Variable.ttf','SourceSerif4-OFL.txt'],['NotoSerifOriya-Variable.ttf','NotoSerifOriya-OFL.txt']]){assert.ok(readFileSync(new URL('../fonts/'+name,import.meta.url)).length>1000);assert.ok(read('fonts/'+licence).includes('SIL OPEN FONT LICENSE'));}
 for(const match of read('styles/utkal.css').matchAll(/url\('([^']+)'\)/g)){
  const url=new URL('../styles/'+match[1],import.meta.url);assert.ok(existsSync(url),match[1]);
  assert.ok(match[1].endsWith('.woff2'),'shared fonts use compressed delivery');
  const file=readFileSync(url);assert.equal(file.subarray(0,4).toString(),'wOF2');
  assert.ok(file.length<readFileSync(new URL(url.href.replace(/\.woff2$/,'.ttf'))).length,'delivery smaller than retained source');
 }
});
test('public package excludes review code and gallery stays outside the UTP export',()=>{
 const p=JSON.parse(read('package.json'));assert.equal(p.private,true);assert.ok(!p.files.includes('dist/'));assert.ok(!p.files.includes('review/'));
 assert.ok(!existsSync(new URL('../../site/dist/design-system/',import.meta.url)));
 assert.ok(read('review/gallery.js').includes('review_preferences_not_approval'));
});
test('five page examples use the actual integrated website version',()=>{
 for(const name of ['chilika','konark','literature','food','journey']){const html=read('dist/design-system/pilots/'+name+'/index.html');assert.ok(!html.includes('uds-pilot-style'));assert.ok(html.includes('name="utkal-design-system" content="'+tokens.version+'"'));assert.ok(html.includes('noindex'));}

});
