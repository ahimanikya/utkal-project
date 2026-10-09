// An audio resume may settle after a stop, page leave or a newer sound choice.
// Only the context still owned by this session may create sound or update UI.
export function createAmbientAudio({createContext,build,onReady,onStop,onError}) {
 let current=null;
 function stop() {
  const previous=current;current=null;
  if(previous) {
   try { Promise.resolve(previous.close()).catch(()=>{}); } catch {}
  }
  onStop();
 }
 async function toggle() {
  if(current){stop();return;}
  let candidate;
  try {
   candidate=createContext();current=candidate;
   await candidate.resume();
   if(current!==candidate)return;
   build(candidate);onReady();
  } catch {
   // Ignore failure from a context the visitor has already stopped/replaced.
   if(candidate&&current!==candidate)return;
   stop();onError();
  }
 }
 return {stop,toggle};
}
