import test from 'node:test';
import assert from 'node:assert/strict';
import {bindStoryContents} from '../src/lib/story-contents.mjs';
function fixture(found=true){
 const handlers={},attributes={};let focused=false,summary=false,prevented=false;
 const heading={hasAttribute:k=>k in attributes,setAttribute:(k,v)=>attributes[k]=v,focus:o=>{focused=o.preventScroll;}};
 const link={getAttribute:()=> '#chapter',addEventListener:(k,fn)=>handlers.click=fn};
 const details={open:true,addEventListener:(k,fn)=>handlers[k]=fn,querySelector:()=>({focus:()=>summary=true}),querySelectorAll:()=>[link]};
 bindStoryContents(details,{getElementById:()=>found?{querySelector:()=>heading}:null});
 return {details,handlers,attributes,get focused(){return focused;},get summary(){return summary;},event:{key:'Escape',preventDefault:()=>prevented=true},get prevented(){return prevented;}};
}
test('mobile contents selection closes disclosure and focuses destination heading',()=>{const f=fixture();f.handlers.click({});assert.equal(f.details.open,false);assert.equal(f.focused,true);assert.equal(f.attributes.tabindex,'-1');});
test('Escape returns focus to contents summary',()=>{const f=fixture();f.handlers.keydown(f.event);assert.equal(f.details.open,false);assert.equal(f.summary,true);assert.equal(f.prevented,true);});
test('modified clicks and missing destinations preserve native behaviour',()=>{for(const e of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){const f=fixture();f.handlers.click(e);assert.equal(f.details.open,true);assert.equal(f.focused,false);}const f=fixture(false);f.handlers.click({});assert.equal(f.details.open,true);});
