import selection from '../../../../kb/research/featured-stories.json';
import publicEdition from '../../editions/coast.json';
import {discoveryEntries} from './discovery';
import {validateStorySelection} from '../lib/featured-selection.mjs';

// Curated admission plus the published edition boundary: draft research cannot leak in.
export const featuredPool = selection.pool.filter(p => p.enabled && publicEdition.routes.includes(p.href)).map(p => {
  const entry=discoveryEntries.find(item=>item.href===p.href);
  if (!entry?.image || !entry.label || !entry.dek || !entry.image.source || !entry.image.creator || !entry.image.license_url)
    throw new Error(`Featured story requires a complete introduction and credited image: ${p.href}`);
  return {...entry,slot:p.slot,preferred_months:p.preferred_months};
});
export const featuredPins = selection.pins;
validateStorySelection(featuredPool, featuredPins);
export const featuredStories=selection.entries.map(({href})=>{
  const entry=featuredPool.find(item=>item.href===href);
  if (!entry) throw new Error(`Featured fallback is not eligible: ${href}`);
  return entry;
});
export const featuredOptions = {
  pool:featuredPool.map(({href,slot,regions,preferred_months})=>({href,slot,regions,preferred_months})),
  pins:featuredPins,
  historyLimit:selection.selection.history_limit,
};
