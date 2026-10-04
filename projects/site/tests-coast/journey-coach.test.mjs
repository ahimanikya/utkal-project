import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('public planner exposes one add-day action before advanced tools and retains private-note and reminder choices',()=>{
 const page=readFileSync('dist-coast/journey/index.html','utf8');
 assert.equal((page.match(/id="add-planning-day"/g)||[]).length,1);
 assert.ok(page.indexOf('id="add-planning-day"')<page.indexOf('Arrange whole days'));
 assert.ok(page.includes('Make this journey yours.'));assert.ok(page.includes('id="journey-coach-next"'));
 const ids=[...page.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const id of ['include-personal-notes','personal-reminders','book-scope','undo-day-change','journey-recovery'])assert.ok(page.includes('id="'+id+'"'));
 assert.match(page,/name="robots" content="noindex/);
});
