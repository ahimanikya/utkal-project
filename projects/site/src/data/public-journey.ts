import {journeyCatalog} from './journey-catalog';
import {bookPhotos} from './book-photos';
import {allowsStarter} from './edition';
import selection from '../../../../kb/research/journey-starters.json';
import {storyTrails} from './story-trails';
export const publicJourney={
 catalog:journeyCatalog,
 starters:selection.starters.filter(s=>allowsStarter(s.id)),
 trails:storyTrails.map(trail=>({...trail,chapters:trail.chapters.map(c=>({...c,photo:bookPhotos[c.photo]}))}))
};
