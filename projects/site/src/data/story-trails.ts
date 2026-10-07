import threeTastes from '../../../../kb/research/food/three-tastes-trail.json';
import stone from '../../../../kb/research/destinations/stone-sea-trail.json';
import chilika from '../../../../kb/research/destinations/chilika-trail.json';
import cuttack from '../../../../kb/research/destinations/cuttack-trail.json';
import balasore from '../../../../kb/research/destinations/balasore-trail.json';
import mayurbhanj from '../../../../kb/research/destinations/mayurbhanj-trail.json';
import visitPlans from '../../../../kb/research/destinations/flexible-visit-plans.json';
import {allowsStarter} from './edition';
export const storyTrails=[stone,chilika,cuttack,balasore,mayurbhanj,threeTastes,...visitPlans.plans].filter(trail=>allowsStarter(trail.starter_id));
