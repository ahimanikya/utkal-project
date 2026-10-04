import test from 'node:test';
import assert from 'node:assert/strict';
import {mountHomeArt} from '../src/scripts/home-art.mjs';

function fixture(count = 12) {
  const caption = {textContent:'Scene 1'};
  const scenes = Array.from({length:count}, (_, i) => {
    const img = {decode:async () => {}};
    return {dataset:{key:`/art/${i}.webp`,title:`Scene ${i + 1}`},hidden:i !== 0,querySelector:() => img};
  });
  const root = {dataset:{},querySelectorAll:() => scenes,querySelector:() => caption};
  return {root,scenes,caption};
}
function memory(previous) {
  return {value:previous,getItem(){return this.value;},setItem(key,value){this.value=value;}};
}
function visible(h) { return h.scenes.filter(scene => !scene.hidden); }

test('a fresh visit can select each artwork and keeps its caption aligned', async () => {
  for (let i=0;i<12;i++) {
    const h=fixture(), storage=memory();
    await mountHomeArt(h.root,{storage,random:()=> (i+0.5)/12});
    assert.deepEqual(visible(h),[h.scenes[i]]);
    assert.equal(h.caption.textContent,`Scene ${i+1}`);
    assert.equal(storage.value,h.scenes[i].dataset.key);
  }
});
test('successive visits never repeat the last displayed artwork', async () => {
  const storage=memory('/art/0.webp');
  for (let i=0;i<20;i++) {
    const previous=storage.value, h=fixture();
    await mountHomeArt(h.root,{storage,random:()=> (i%10)/10});
    assert.notEqual(storage.value,previous);
    assert.equal(visible(h).length,1);
  }
});
test('a removed artwork in storage does not exclude current choices', async () => {
  const h=fixture();
  await mountHomeArt(h.root,{storage:memory('/removed.webp'),random:()=>0});
  assert.deepEqual(visible(h),[h.scenes[0]]);
});
test('blocked storage reads and writes do not prevent selection', async () => {
  const h=fixture();
  await mountHomeArt(h.root,{storage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},random:()=>0.6});
  assert.deepEqual(visible(h),[h.scenes[7]]);
});
test('an unavailable storage API still permits selection', async () => {
  const h=fixture();
  await mountHomeArt(h.root,{storage:null,random:()=>0.9});
  assert.deepEqual(visible(h),[h.scenes[10]]);
});
test('failed image loading restores the static fallback and matching caption', async () => {
  const h=fixture(), storage=memory();
  h.scenes[7].querySelector().decode=async()=>{throw Error('offline');};
  await mountHomeArt(h.root,{storage,random:()=>0.6});
  assert.deepEqual(visible(h),[h.scenes[0]]);
  assert.equal(h.caption.textContent,'Scene 1');
  assert.equal(storage.value,'/art/0.webp');
});
test('reinitializing the same page leaves its selected image unchanged', async () => {
  const h=fixture(), storage=memory();
  await mountHomeArt(h.root,{storage,random:()=>0.9});
  await mountHomeArt(h.root,{storage,random:()=>0});
  assert.deepEqual(visible(h),[h.scenes[10]]);
});
test('single-image and empty collections are safe', async () => {
  const h=fixture(1);
  await mountHomeArt(h.root,{storage:memory('/art/0.webp'),random:()=>0.9});
  assert.deepEqual(visible(h),[h.scenes[0]]);
  await mountHomeArt(fixture(0).root,{storage:null});
});
