import test from 'node:test';
import assert from 'node:assert/strict';
import {normaliseSearch, matchesDiscovery} from '../src/lib/discovery.mjs';
import {matchesWords} from '../src/lib/search.mjs';

test('Latin transliteration accents match in both directions and Unicode forms',()=>{
 for(const [marked,plain] of [['Piṭhā','pitha'],['Oḍiśā','odisa'],['Mṛdaṅga','mrdanga'],['Śatānanda','satananda'],['Café','cafe']]) {
  for(const form of ['NFC','NFD']) {
   const query=marked.normalize(form);
   assert.equal(normaliseSearch(query),plain);
   assert.equal(matchesWords(plain,query),true);
   assert.equal(matchesWords(query,plain),true);
   assert.equal(matchesDiscovery({label:plain},{q:query}),true);
   assert.equal(matchesDiscovery({label:query},{q:plain}),true);
  }
 }
});

test('accent folding preserves meaningful non-Latin marks and Odia vowel distinctions',()=>{
 for(const text of ['ପିଠା','ଓଡ଼ିଆ','किताब','عَرَبِيّ','άλφα']) {
  assert.equal(normaliseSearch(text),text.normalize('NFKC').toLocaleLowerCase());
 }
 assert.equal(matchesDiscovery({label:'ପିଠା'},{q:'ପଠା'}),false);
 assert.equal(matchesWords('କି','କା'),false);
 assert.equal(normaliseSearch('Piṭhā · ପିଠା'),'pitha ପିଠା');
});

test('folded search retains filter conjunctions and does not invent transliteration aliases',()=>{
 const entry={label:'Pitha',category:'Food',regions:['Puri'],aliases:['ପିଠା']};
 assert.equal(matchesDiscovery(entry,{q:'piṭhā',topic:'Food',region:'Puri'}),true);
 assert.equal(matchesDiscovery(entry,{q:'piṭhā',topic:'People'}),false);
 assert.equal(matchesDiscovery(entry,{q:'piṭhā',region:'Cuttack'}),false);
 assert.equal(matchesDiscovery(entry,{q:'piṭhā unknown'}),false);
 assert.equal(matchesWords('Odisha','Oḍiśā'),false); // s is not automatically sh
 assert.equal(matchesWords('Pitha','ପିଠା'),false); // explicit aliases still required
 assert.equal(entry.label,'Pitha');
});
