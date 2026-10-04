import {journeyCatalog} from './journey-catalog';
import {bookPhotos} from './book-photos';
import {allowsStarter} from './edition';
import selection from '../../../../kb/research/journey-starters.json';
import trail from '../../../../kb/research/destinations/stone-sea-trail.json';
export const publicJourney={
 catalog:journeyCatalog,
 starters:selection.starters.filter(s=>allowsStarter(s.id)),
 trails:allowsStarter(trail.starter_id)?[{...trail,chapters:trail.chapters.map(c=>({...c,photo:bookPhotos[c.photo]}))}]:[]
};
