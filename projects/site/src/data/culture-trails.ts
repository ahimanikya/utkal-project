import collection from '../../../../kb/research/voices/culture-trails.json';
import {allowsPage} from './edition';
import {selectCultureTrails} from '../lib/culture-trails.mjs';
export const cultureTrailsFor=(path?:string,all=false)=>selectCultureTrails(collection.trails,{path,all,allowsPage});
