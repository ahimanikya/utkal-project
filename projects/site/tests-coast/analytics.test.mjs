import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validMeasurementId} from '../src/lib/analytics.mjs';
const routes=JSON.parse(readFileSync('editions/coast.json','utf8')).routes;
test('coastal analytics configuration is explicit and never eagerly loads the remote tag',()=>{
 const id=process.env.PUBLIC_GA_MEASUREMENT_ID||'';
 for(const route of routes){
  const html=readFileSync('dist-coast'+(route.endsWith('/')?route+'index.html':route),'utf8');
  assert.doesNotMatch(html,/<script\b[^>]*\bsrc=["']https?:\/\//i);
  const raw=html.match(/<script[^>]*id="analytics-config"[^>]*>([\s\S]*?)<\/script>/);
  if(!validMeasurementId(id)){assert.equal(raw,null);continue;}
  assert.ok(raw,route);
  const config=JSON.parse(raw[1]);
  assert.equal(config.id,id);assert.deepEqual(config.allowedPaths,routes);
  assert.equal(new URL(config.canonical).origin,'https://utkalproject.org');
  assert.equal(new URL(config.canonical).search,'');
  assert.match(html,/id="analytics-choice"[^>]*hidden/);
  assert.match(html,/Cookie preferences/);
 }
});
