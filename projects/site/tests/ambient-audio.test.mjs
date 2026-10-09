import test from 'node:test';
import assert from 'node:assert/strict';
import {createAmbientAudio} from '../src/lib/ambient-audio.mjs';
function fixture() {
 const contexts=[],built=[],events=[];
 const audio=createAmbientAudio({
  createContext(){const c={closed:0,close(){this.closed++;return Promise.resolve();},resume(){return new Promise((resolve,reject)=>Object.assign(this,{resolve,reject}));}};contexts.push(c);return c;},
  build(c){built.push(c);},onReady(){events.push('ready');},onStop(){events.push('stop');},onError(){events.push('error');}
 });
 return {audio,contexts,built,events};
}
test('stopping a pending resume never builds audio or restarts playback',async()=>{
 const {audio,contexts,built,events}=fixture();const pending=audio.toggle();audio.stop();contexts[0].resolve();await pending;
 assert.equal(contexts[0].closed,1);assert.deepEqual(built,[]);assert.deepEqual(events,['stop']);
});
test('rapid on/off/on ignores the old resume and only starts the latest context',async()=>{
 const {audio,contexts,built,events}=fixture();const first=audio.toggle();await audio.toggle();const latest=audio.toggle();
 contexts[0].resolve();await first;assert.deepEqual(built,[]);assert.deepEqual(events,['stop']);
 contexts[1].resolve();await latest;assert.deepEqual(built,[contexts[1]]);assert.deepEqual(events,['stop','ready']);
 audio.stop();assert.deepEqual(contexts.map(c=>c.closed),[1,1]);
});
test('an obsolete failure cannot stop or overwrite a newer sound session',async()=>{
 const {audio,contexts,built,events}=fixture();const first=audio.toggle();audio.stop();const latest=audio.toggle();contexts[1].resolve();await latest;
 contexts[0].reject(new Error('closed during resume'));await first;
 assert.deepEqual(built,[contexts[1]]);assert.deepEqual(events,['stop','ready']);assert.equal(contexts[1].closed,0);audio.stop();
});
test('failed current audio closes its context and remains retryable',async()=>{
 const {audio,contexts,events}=fixture();const first=audio.toggle();contexts[0].reject(new Error('unavailable'));await first;
 assert.equal(contexts[0].closed,1);assert.deepEqual(events,['stop','error']);const second=audio.toggle();contexts[1].resolve();await second;assert.equal(events.at(-1),'ready');audio.stop();
});
test('unsupported audio and failed sound construction report failure without throwing',async()=>{
 const events=[];
 const absent=createAmbientAudio({createContext(){throw new Error('unsupported');},onStop(){events.push('stop');},onError(){events.push('error');}});await absent.toggle();assert.deepEqual(events,['stop','error']);
 let closed=0;const broken=createAmbientAudio({createContext:()=>({resume:async()=>{},close(){closed++;return Promise.reject(new Error('already closed'));}}),build(){throw new Error('build');},onStop(){},onError(){events.push('build error');}});await broken.toggle();assert.equal(closed,1);assert.equal(events.at(-1),'build error');
});
