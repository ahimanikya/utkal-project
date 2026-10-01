import test from 'node:test';
import assert from 'node:assert/strict';
import {revealFragment,bindFragmentNavigation,focusFragment} from '../src/lib/fragment-navigation.mjs';
function element(tag,parent=null){
 const attributes=new Map();return {tagName:tag,parentElement:parent,open:false,focused:false,scrolled:false,querySelector:()=>null,hasAttribute:k=>attributes.has(k),getAttribute:k=>attributes.get(k),setAttribute:(k,v)=>attributes.set(k,v),focus(options){this.focused=options;},scrollIntoView(options){this.scrolled=options;}};
}
function fixture(hash='#poem'){
 const outside=element('DETAILS'),outer=element('DETAILS'),inner=element('DETAILS',outer),target=element('ARTICLE',inner),heading=element('H3',target);
 target.querySelector=()=>heading;
 const events={},doc={getElementById:id=>['poem','କବିତା','source:1'].includes(id)?target:null,addEventListener:(type,fn)=>events[type]=fn};
 const win={location:{hash,href:'https://example.test/guide/'+hash},addEventListener:(type,fn)=>events[type]=fn};
 return {outside,outer,inner,target,heading,events,doc,win};
}
function click(f,overrides={},linkChanges={}){
 const link={href:'https://example.test/guide/#poem',target:'',hasAttribute:()=>false,...linkChanges};
 f.events.click({target:{closest:()=>link},...overrides});
}
test('fragment arrival reveals nested panels only and scrolls without stealing focus',()=>{
 const f=fixture();bindFragmentNavigation(f.doc,f.win);
 assert.ok(f.outer.open&&f.inner.open);assert.equal(f.outside.open,false);
 assert.deepEqual(f.target.scrolled,{behavior:'instant',block:'start'});assert.equal(f.heading.focused,false);
});
test('encoded Odia and punctuation IDs resolve without selectors',()=>{
 for(const hash of ['#'+encodeURIComponent('କବିତା'),'#source%3A1']){const f=fixture();assert.equal(revealFragment(hash,f.doc).target,f.target);}
});
test('empty, missing and malformed fragments leave panels untouched',()=>{
 for(const hash of ['', '#','#missing','#%E0%A']){const f=fixture(hash);bindFragmentNavigation(f.doc,f.win);assert.equal(f.inner.open,false);assert.equal(f.target.scrolled,false);}
});
test('normal links open collapsed destinations, focus their heading and keep native navigation',()=>{
 const f=fixture('');bindFragmentNavigation(f.doc,f.win);click(f,{preventDefault:()=>assert.fail('native navigation must remain')});
 assert.ok(f.inner.open&&f.outer.open);assert.deepEqual(f.heading.focused,{preventScroll:true});assert.equal(f.target.scrolled,false);
 // A repeated click to the same fragment must also reveal panels closed by the reader.
 f.inner.open=false;click(f);assert.equal(f.inner.open,true);
});
test('modified, cancelled, download, external, new-tab and other-page links stay native',()=>{
 for(const overrides of [{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){
  const f=fixture('');bindFragmentNavigation(f.doc,f.win);click(f,overrides);assert.equal(f.inner.open,false);
 }
 for(const link of [{target:'_blank'},{hasAttribute:()=>true},{href:'https://other.test/guide/#poem'},{href:'https://example.test/other/#poem'},{href:'https://example.test/guide/?mode=other#poem'}]){
  const f=fixture('');bindFragmentNavigation(f.doc,f.win);click(f,{},link);assert.equal(f.inner.open,false);
 }
});
test('back/forward fragment events reveal a newly collapsed target without focusing it',()=>{
 const f=fixture('');bindFragmentNavigation(f.doc,f.win);f.win.location.hash='#poem';f.events.hashchange();
 assert.ok(f.inner.open);assert.equal(f.heading.focused,false);
});
test('already visible targets keep the native scroll and focus',()=>{
 const f=fixture();f.inner.open=f.outer.open=true;bindFragmentNavigation(f.doc,f.win);click(f);
 assert.equal(f.target.scrolled,false);assert.equal(f.heading.focused,false);
});
test('a disclosure target focuses its summary and preserves existing tabindex',()=>{
 const f=fixture();const summary=element('SUMMARY');summary.setAttribute('tabindex','0');f.inner.querySelector=()=>summary;
 focusFragment(f.inner);assert.deepEqual(summary.focused,{preventScroll:true});assert.equal(summary.getAttribute('tabindex'),'0');
});

test('focusing a native disclosure summary does not remove it from the tab order',()=>{
 const f=fixture();const summary=element('SUMMARY');f.inner.querySelector=()=>summary;
 focusFragment(f.inner);assert.deepEqual(summary.focused,{preventScroll:true});assert.equal(summary.hasAttribute('tabindex'),false);
});
