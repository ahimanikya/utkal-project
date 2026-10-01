import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateSearchSelection,candidateRobots,searchSitemap,candidateCrawlers} from '../src/lib/search-launch.mjs';
const selection=JSON.parse(readFileSync('editions/search-candidate.json','utf8')),scope=JSON.parse(readFileSync('editions/coast.json','utf8'));
test('every live route has an explicit proposal or hold; utility routes cannot be indexed',()=>{
 const proposed=validateSearchSelection(selection,scope.routes);assert.equal(proposed.length,11);
 for(const mutate of [s=>s.pages.pop(),s=>s.pages.push(s.pages[0]),s=>s.pages[0].route='/store/',s=>s.pages.find(p=>p.route==='/journey/').decision='proposed',s=>s.status='approved']){const s=structuredClone(selection);mutate(s);assert.throws(()=>validateSearchSelection(s,scope.routes));}
});
test('candidate indexing is page-specific and fails closed for unexpected HTML',()=>{
 const html='<head><meta name="robots" content="noindex, nofollow"></head><body>Story</body>';
 assert.match(candidateRobots(html,true),/content="index, follow"/);assert.match(candidateRobots(html,false),/content="noindex, follow"/);
 for(const bad of ['<head></head>',html+html,html.replace('noindex, nofollow','index, follow')])assert.throws(()=>candidateRobots(bad,true));
});
test('sitemap includes only selected canonical routes and crawler access permits reading noindex',()=>{
 const routes=validateSearchSelection(selection,scope.routes),xml=searchSitemap(routes);assert.equal((xml.match(/<loc>/g)||[]).length,11);assert.doesNotMatch(xml,/journey|contribute|store|404/);assert.throws(()=>searchSitemap(['/../store/']));assert.match(candidateCrawlers,/Allow: \/\n/);assert.doesNotMatch(candidateCrawlers,/Disallow/);
});
