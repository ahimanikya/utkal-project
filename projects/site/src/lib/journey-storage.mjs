import {LIBRARY_KEY,STORAGE_KEY,validateLibrary} from './journey.mjs';
export function storageSnapshot(storage){try{return {current:storage.getItem(LIBRARY_KEY),legacy:storage.getItem(STORAGE_KEY)};}catch{return null;}}
// A synchronous last-moment comparison reduces stale-tab overwrites. localStorage
// has no cross-process transaction primitive; the storage event also blocks edits.
export function saveLibraryChecked(storage,library,expected){
 try{
  const raw=JSON.stringify(validateLibrary(library)),now=storageSnapshot(storage);
  if(!now||!expected)return {status:'unavailable',snapshot:expected};
  if(now.current!==expected.current||now.legacy!==expected.legacy)return {status:'conflict',snapshot:expected};
  storage.setItem(LIBRARY_KEY,raw);return {status:'saved',snapshot:{current:raw,legacy:now.legacy}};
 }catch{return {status:'unavailable',snapshot:expected};}
}
