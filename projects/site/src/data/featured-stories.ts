import selection from '../../../../kb/research/featured-stories.json';
import {discoveryEntries} from './discovery';

// Resolve against the active edition so a curated pick cannot bypass its boundary.
export const featuredStories=selection.entries.map(({href})=>{
 const entry=discoveryEntries.find(item=>item.href===href);
 if(!entry?.image) throw new Error(`Featured story is missing from this edition or has no image: ${href}`);
 return entry;
});
