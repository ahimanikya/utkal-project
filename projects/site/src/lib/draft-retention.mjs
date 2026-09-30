// A request to download is not evidence that the user kept a copy.
// Only a confirmed copy or explicit acknowledgement marks this revision kept.
export function createDraftRetention(){
 let revision=0,keptRevision=-1,hasContent=false;
 return {
  edit(populated){hasContent=Boolean(populated);revision++;},
  version(){return revision;},
  isCurrent(version){return version===revision;},
  keep(version){if(version!==revision)return false;keptRevision=revision;return true;},
  needsReminder(){return hasContent&&keptRevision!==revision;}
 };
}
