import comparison from '../../../../kb/research/trail-comparison.json';
import {storyTrails} from './story-trails';
import {bookPhotos} from './book-photos';
export const trailInterests=comparison.interests;
export const trailComparisons=comparison.trails.flatMap(choice=>{
 const trail=storyTrails.find(t=>t.starter_id===choice.trail_id);
 if(!trail)return [];
 const photo=bookPhotos[trail.chapters[0].photo];
 if(!photo)throw Error('Missing comparison photo: '+choice.id);
 return [{...choice,title:trail.title,href:trail.href,photo,chapters:trail.chapters.length}];
});
