import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraftRetention} from '../src/lib/draft-retention.mjs';

test('an unkept draft keeps the leave-page reminder until the current copy is acknowledged',()=>{
 const draft=createDraftRetention();assert.equal(draft.needsReminder(),false);
 draft.edit(true);const requestedVersion=draft.version();
 assert.equal(draft.needsReminder(),true); // capturing a download version is not a receipt
 assert.equal(draft.keep(requestedVersion),true);assert.equal(draft.needsReminder(),false);
});
test('a late clipboard completion cannot mark subsequent edits as kept',()=>{
 const draft=createDraftRetention();draft.edit(true);const pendingCopy=draft.version();
 draft.edit(true);assert.equal(draft.keep(pendingCopy),false);assert.equal(draft.isCurrent(pendingCopy),false);
 assert.equal(draft.needsReminder(),true);
});
test('editing after a kept copy restores the reminder and emptying the draft removes it',()=>{
 const draft=createDraftRetention();draft.edit(true);draft.keep(draft.version());
 draft.edit(true);assert.equal(draft.needsReminder(),true);
 draft.edit(false);assert.equal(draft.needsReminder(),false);
});
