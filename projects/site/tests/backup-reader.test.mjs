import test from 'node:test';
import assert from 'node:assert/strict';
import {createBackupReader} from '../src/lib/backup-reader.mjs';
import {MAX_LIBRARY_BYTES,parseBackup} from '../src/lib/journey.mjs';

const plan=title=>({version:1,title,items:[{id:'place:chilika',day:2,notes:'Keep ଓଡ଼ିଶା notes'}]});
const file=value=>({size:JSON.stringify(value).length,text:async()=>JSON.stringify(value)});
function delayed(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {file:{size:20,text:()=>promise},resolve,reject};}

test('latest backup wins when an earlier read completes later',async()=>{
 const reader=createBackupReader(),old=delayed(),earlier=reader.read(old.file);
 assert.deepEqual(await reader.read(file(plan('Latest'))),{status:'ready',candidate:plan('Latest')});
 old.resolve(JSON.stringify(plan('Earlier')));assert.deepEqual(await earlier,{status:'superseded'});
});
test('late failure cannot replace a newer successful preview',async()=>{
 const reader=createBackupReader(),old=delayed(),earlier=reader.read(old.file);
 assert.equal((await reader.read(file(plan('Latest')))).status,'ready');old.reject(Error('Disk failure'));assert.deepEqual(await earlier,{status:'superseded'});
});
test('a newer invalid choice does not fall back to an earlier valid file',async()=>{
 const reader=createBackupReader(),old=delayed(),earlier=reader.read(old.file);
 assert.equal((await reader.read({size:1,text:async()=>'{'})).status,'error');old.resolve(JSON.stringify(plan('Earlier')));assert.equal((await earlier).status,'superseded');
});
test('oversized file is rejected without reading and supersedes an older read',async()=>{
 const reader=createBackupReader(),old=delayed(),earlier=reader.read(old.file);let reads=0;
 assert.equal((await reader.read({size:MAX_LIBRARY_BYTES+1,text:async()=>{reads++;return '{}';}})).status,'error');assert.equal(reads,0);
 old.resolve(JSON.stringify(plan('Earlier')));assert.equal((await earlier).status,'superseded');
});
test('cancelling a pending read leaves it unable to create a preview',async()=>{
 const reader=createBackupReader(),old=delayed(),earlier=reader.read(old.file);reader.cancel();old.resolve(JSON.stringify(plan('Earlier')));assert.equal((await earlier).status,'superseded');
 assert.equal((await reader.read(file(plan('Retry')))).status,'ready');
});
test('collection imports retain active journey and private details',async()=>{
 const collection={version:2,activeId:'two',trips:[{id:'one',plan:plan('One')},{id:'two',plan:{...plan('Two'),dayNotes:[{day:2,title:'Pause',notes:'Private day'}],reminders:[{id:'r',text:'Ask first',done:false}],checklist:['transport'],startDate:'2026-12-01'}}]};
 assert.deepEqual((await createBackupReader().read(file(collection))).candidate,parseBackup(JSON.stringify(collection)));
});
test('a failed read can be retried and readers are independent',async()=>{
 const a=createBackupReader(),b=createBackupReader();assert.equal((await a.read({size:1,text:async()=>{throw Error('Read failed');}})).status,'error');
 const pending=delayed(),read=b.read(pending.file);a.cancel();pending.resolve(JSON.stringify(plan('Independent')));assert.equal((await read).status,'ready');assert.equal((await a.read(file(plan('Retry')))).status,'ready');
});
