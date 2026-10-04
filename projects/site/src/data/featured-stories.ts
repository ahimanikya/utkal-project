import selection from '../../../../kb/research/featured-stories.json';
import publicEdition from '../../editions/coast.json';
import {homeArt} from './home-art';
import {discoveryEntries} from './discovery';
import {validateStorySelection} from '../lib/featured-selection.mjs';

// Curated admission plus the published edition boundary: draft research cannot leak in.
export const featuredPool = selection.pool.filter(p => p.enabled && publicEdition.routes.includes(p.href)).map(p => {
  const entry=discoveryEntries.find(item=>item.href===p.href);
  if (!entry?.image || !entry.label || !entry.dek || !entry.image.source || !entry.image.creator || !entry.image.license_url)
    throw new Error(`Featured story requires a complete introduction and credited image: ${p.href}`);
  if (!p.intro?.trim()) throw new Error(`Featured story needs an editorial introduction: ${p.href}`);
  return {...entry,dek:p.intro,slot:p.slot,preferred_months:p.preferred_months};
});
const themes=selection.theme_connections;
if (new Set(themes.map(t=>t.theme)).size!==themes.length || themes.length!==homeArt.length)
  throw new Error('Each homepage artwork theme requires one curated connection record');
for (const scene of homeArt) {
  const connection=themes.find(t=>t.theme===scene.theme);
  if (!connection?.preferred.length || !connection.reason || connection.preferred.some(href=>!featuredPool.some(e=>e.href===href)))
    throw new Error(`Incomplete or unpublished story connection for ${scene.theme}`);
}
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
  themes:themes.map(({theme,preferred})=>({theme,preferred})),
};
