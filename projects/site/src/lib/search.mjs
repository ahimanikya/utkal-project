import {normaliseSearch} from './discovery.mjs';
export const matchesWords=(text,query)=>normaliseSearch(query).split(/\s+/).every(word=>normaliseSearch(text).includes(word));
export const boundedQuery=value=>String(value||'').slice(0,200);
