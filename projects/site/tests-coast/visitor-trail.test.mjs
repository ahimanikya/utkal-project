import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('coastal homepage leads to an illustrated, saveable trail with in-edition guide links',()=>{
 const root='dist-coast',home=readFileSync(root+'/index.html','utf8'),page=readFileSync(root+'/journey-starters/index.html','utf8');
 assert.ok(home.includes('href="/journey-starters/#stone-sea-makers"'));
 const data=JSON.parse(page.match(/id="journey-data"[^>]*>(.*?)<\/script>/s)[1]);
 const starter=data.starters.find(s=>s.id==='stone-sea-makers');assert.equal(starter.items.length,8);
 for(const id of starter.items){const idea=data.catalog.find(i=>i.id===id);assert.ok(idea,id);assert.ok(page.includes(`href="${idea.href}"`));const [route,fragment]=idea.href.split('#');const guide=readFileSync(root+route+'index.html','utf8');if(fragment)assert.ok(guide.includes(`id="${fragment}"`));assert.ok(guide.includes('href="/journey-starters/#stone-sea-makers"'));}
 const section=page.slice(page.indexOf('id="stone-sea-makers"'),page.indexOf('Find another beginning.'));
 assert.equal((section.match(/<img /g)||[]).length,3);
 for(const match of section.matchAll(/<img[^>]*src="([^"]+)"/g))assert.ok(existsSync(root+match[1]));
 assert.equal((section.match(/data-journey-starter="stone-sea-makers"/g)||[]).length,1);
 assert.ok(section.includes('aria-describedby="starter-status-stone-sea-makers"'));
 assert.ok(section.includes('Every idea begins unscheduled'));
});
