import test from 'node:test';
import assert from 'node:assert/strict';
import {bindStoryContents} from '../src/lib/story-contents.mjs';
function fixture(found=true){
 const handlers={},attributes={},targetAttributes={},frames=[];let aligned=false;let focused=false,summary=false,prevented=false;
 const heading={hasAttribute:k=>k in attributes,setAttribute:(k,v)=>attributes[k]=v,focus:o=>{focused=o.preventScroll;}};
 const link={getAttribute:()=> '#chapter',addEventListener:(k,fn)=>handlers.click=fn};
 const details={open:true,addEventListener:(k,fn)=>handlers[k]=fn,querySelector:()=>({focus:()=>summary=true}),querySelectorAll:()=>[link]};
 bindStoryContents(details,{defaultView:{requestAnimationFrame:fn=>frames.push(fn)},getElementById:()=>found?{querySelector:()=>heading,hasAttribute:k=>k in targetAttributes,setAttribute:(k,v)=>targetAttributes[k]=v,scrollIntoView:o=>aligned=o.block==='start'&&o.behavior==='instant'}:null});
 return {details,handlers,attributes,targetAttributes,frames,get aligned(){return aligned;},get focused(){return focused;},get summary(){return summary;},event:{key:'Escape',preventDefault:()=>prevented=true},get prevented(){return prevented;}};
}
test('mobile contents selection closes disclosure and focuses destination heading',()=>{const f=fixture();f.handlers.click({});assert.equal(f.details.open,false);assert.equal(f.focused,true);assert.equal(f.attributes.tabindex,'-1');assert.equal(f.targetAttributes.tabindex,'-1');});
test('Escape returns focus to contents summary',()=>{const f=fixture();f.handlers.keydown(f.event);assert.equal(f.details.open,false);assert.equal(f.summary,true);assert.equal(f.prevented,true);});
test('modified clicks and missing destinations preserve native behaviour',()=>{for(const e of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){const f=fixture();f.handlers.click(e);assert.equal(f.details.open,true);assert.equal(f.focused,false);}const f=fixture(false);f.handlers.click({});assert.equal(f.details.open,true);});
test('mobile contents opens a collapsed destination and focuses its visible summary',()=>{
 const handlers={},summaryAttributes={};let focused=false;
 const summary={tagName:'SUMMARY',hasAttribute:k=>k in summaryAttributes,setAttribute:(k,v)=>summaryAttributes[k]=v,focus:()=>focused=true};
 const panel={tagName:'DETAILS',open:false,parentElement:null,querySelector:()=>summary,hasAttribute:()=>false,setAttribute:()=>{}};
 const link={getAttribute:()=> '#poems-songs',addEventListener:(type,handler)=>handlers[type]=handler};
 const menu={open:true,addEventListener:()=>{},querySelectorAll:()=>[link]};
 bindStoryContents(menu,{defaultView:{requestAnimationFrame:()=>{}},getElementById:()=>panel});handlers.click({});
 assert.equal(menu.open,false);assert.equal(panel.open,true);assert.equal(focused,true);assert.equal(summaryAttributes.tabindex,undefined);
});

test('after native navigation the closed-menu layout is aligned and the heading keeps focus',()=>{
 const f=fixture();f.handlers.click({});assert.equal(f.frames.length,1);assert.equal(f.aligned,false);f.frames[0]();assert.equal(f.aligned,true);assert.equal(f.focused,true);
 // A second selection must work even when the URL already has that fragment.
 f.details.open=true;f.handlers.click({});assert.equal(f.frames.length,2);f.frames[1]();assert.equal(f.details.open,false);assert.equal(f.aligned,true);
});
