import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {selection,districtRows,stateMultilingual,percent,csvRows} from '../src/lib/language-atlas.mjs';
const data=JSON.parse(readFileSync(new URL('../../../kb/research/voices/population-2011.json',import.meta.url)));
test('Census groups and individual entries are distinct and preserve significant counts',()=>{
 assert.equal(selection(data,'015000').persons,34712170);
 assert.equal(selection(data,'015043').persons,31507158);
 assert.equal(selection(data,'015058').persons,2629495);
 assert.equal(selection(data,'015014').persons,225188);
 assert.equal(selection(data,'058006').persons,6451);
 assert.equal(selection(data,'015043').label.parent,'015000');
 assert.equal(data.areas['000'].population[0],41974218);
 assert.equal(Object.values(data.labels).filter(l=>l.level==='language_group').length,90);
});
test('every language and residence reconciles across districts, with matching denominators',()=>{
 for(const code of Object.keys(data.labels))for(const residence of ['total','rural','urban']){
  const s=selection(data,code,residence),rows=districtRows(data,code,residence);
  assert.equal(rows.length,30);assert.equal(rows.reduce((n,r)=>n+(r.persons??0),0),s.persons);
  assert.equal(rows.reduce((n,r)=>n+r.population,0),s.population);
  for(const r of rows)if(r.persons!==null){assert.equal(r.persons,r.males+r.females);assert.equal(r.share,r.persons/r.population*100);assert.equal(r.distribution,s.persons?r.persons/s.persons*100:null)}
 }
});
test('missing entries remain distinct from recorded zero and filtered district shares retain statewide denominator',()=>{
 const sparse=districtRows(data,'058006');assert.ok(sparse.some(r=>r.persons===null));
 const one=districtRows(data,'015000','urban','name','Khurda');assert.equal(one.length,0);
 const target=districtRows(data,'015000','urban','count')[0];
 const filtered=districtRows(data,'015000','urban','count',target.name.toLowerCase());
 assert.deepEqual(filtered,[target]);assert.ok(filtered[0].distribution<100);
 assert.ok(csvRows(sparse).includes('Not separately listed'));
});
test('group-only multilingualism never transfers parent counts to individual entries',()=>{
 assert.equal(stateMultilingual(data,'015043'),null);
 for(const label of Object.values(data.labels).filter(l=>l.level==='language_group')){
  const m=stateMultilingual(data,label.code);assert.ok(m);assert.equal(m.population[0],selection(data,label.code).persons);
  assert.ok(m.three_languages[0]<=m.at_least_two_languages[0]);assert.ok(m.at_least_two_languages[0]<=m.population[0]);
 }
});
test('invalid URL inputs fall back safely, tiny positive shares stay visible, sorting is numerical',()=>{
 assert.equal(selection(data,'__proto__','constructor').code,'015000');assert.equal(selection(data,'bogus','urban').residence,'urban');
 assert.equal(percent(1,41974218),'<0.01%');assert.equal(percent(0,10),'0.00%');assert.equal(percent(0,0),'—');
 const rows=districtRows(data,'015043','total','share');for(let i=1;i<rows.length;i++)assert.ok((rows[i-1].share??-1)>=(rows[i].share??-1));
});

test('CSV preserves the selected entry, year and residence alongside counts',()=>{const s=selection(data,'015043','urban'),csv=csvRows(districtRows(data,s.code,s.residence),s);assert.match(csv,/Year,Entry code,Entry label,Classification,Residence/);assert.ok(csv.includes('"2011","015043","Odia","mother_tongue","urban"'));});
