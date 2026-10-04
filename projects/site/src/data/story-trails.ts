import stone from '../../../../kb/research/destinations/stone-sea-trail.json';
import chilika from '../../../../kb/research/destinations/chilika-trail.json';
import cuttack from '../../../../kb/research/destinations/cuttack-trail.json';
import {allowsStarter} from './edition';
export const storyTrails=[stone,chilika,cuttack].filter(trail=>allowsStarter(trail.starter_id));
