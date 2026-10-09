import {MAX_LIBRARY_BYTES,parseBackup} from './journey.mjs';

// File.text() can finish out of order. Only the latest selection may affect UI.
// This reader never writes saved journeys; the user still reviews the preview.
export function createBackupReader(){
 let latest=0;
 return {
  cancel(){latest++;},
  async read(file){
   const request=++latest;
   try{
    if(file.size>MAX_LIBRARY_BYTES)throw Error('Choose a JSON journey smaller than 10 MB.');
    const raw=await file.text();
    if(request!==latest)return {status:'superseded'};
    return {status:'ready',candidate:parseBackup(raw)};
   }catch(error){
    if(request!==latest)return {status:'superseded'};
    return {status:'error',message:error instanceof Error?error.message:'Could not read that journey.'};
   }
  }
 };
}
