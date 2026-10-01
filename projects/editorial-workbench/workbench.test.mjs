import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {filterRecords} from './workbench.mjs';
const data=JSON.parse(readFileSync(new URL('../../kb/records/editorial-workbench.json',import.meta.url)));
test('searches actual record identities, source relationships and Odia metadata without modifying the selection',()=>{
 const before=JSON.stringify(data.records);
 assert.ok(filterRecords(data.records,{query:'Enduri',kind:'Food'}).some(r=>r.id==='subject:food/enduri-pitha'));
 assert.equal(filterRecords(data.records,{query:'a completely absent phrase 197462'}).length,0);
 assert.deepEqual(filterRecords(data.records,{query:'  ENDURI '}),filterRecords(data.records,{query:'enduri'}));
 assert.equal(JSON.stringify(data.records),before);
});
test('focus filters distinguish source aliases, mapped pages and research still without a page',()=>{
 for(const r of filterRecords(data.records,{focus:'page'}))assert.ok(r.public_route);
 for(const r of filterRecords(data.records,{focus:'unmapped'})){assert.notEqual(r.kind,'Source');assert.equal(r.public_route,null)}
 for(const r of filterRecords(data.records,{focus:'shared'})){assert.equal(r.kind,'Source');assert.ok(r.related_source_ids.length)}
 assert.equal(filterRecords(data.records,{focus:'unexpected'}).length,0);
});
test('portable HTML embeds the complete selection without external scripts, analytics or write actions',()=>{
 const html=readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/\/\*__WORKBENCH|<script[^>]+src=|fetch\(|localStorage|gtag\(/);
 assert.match(html,/role="status" aria-live="polite"/);assert.match(html,/noindex,nofollow/);
 assert.match(html,/\.textContent=text/);assert.doesNotMatch(html,/innerHTML/);
});
