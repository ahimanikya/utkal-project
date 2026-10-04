const lastArtKey = 'utkal:home-art:last';

// Store only the artwork path: a local display preference, not a visitor identifier.
function browserStorage() {
  try { return window.localStorage; } catch { return null; }
}

export async function mountHomeArt(root, {storage = browserStorage(), random = Math.random, decodeTimeoutMs = 4000} = {}) {
  if (root.dataset.ready) return root.dataset.theme;
  root.dataset.ready = 'true';
  const scenes = [...root.querySelectorAll('[data-scene]')];
  if (!scenes.length) return;
  let previous;
  try { previous = storage?.getItem(lastArtKey); } catch { /* Storage may be disabled. */ }
  const alternatives = scenes.filter(scene => scene.dataset.key !== previous);
  const choices = alternatives.length ? alternatives : scenes;
  const chosen = choices[Math.floor(random() * choices.length)];
  const caption = root.querySelector('[data-caption]');
  function display(scene) {
    scenes.forEach(candidate => { candidate.hidden = candidate !== scene; });
    caption.textContent = scene.dataset.title;
    root.dataset.theme = scene.dataset.theme;
  }
  // Choose once during page setup. There is no animation or rotation timer; the timeout below only handles loading failure.
  const img = chosen.querySelector('img');
  img.loading = 'eager';
  img.fetchPriority = 'high';
  display(chosen);
  let displayed = chosen;
  let timeout;
  try {
    await Promise.race([img.decode(),new Promise((_,reject)=>{
      timeout=setTimeout(()=>reject(new Error('Image decode timed out')),decodeTimeoutMs);
    })]);
  } catch {
    // The original static artwork is also the no-JavaScript fallback.
    displayed = scenes[0];
    display(displayed);
  } finally { clearTimeout(timeout); }
  try { storage?.setItem(lastArtKey, displayed.dataset.key); } catch { /* Still works without storage. */ }
  return displayed.dataset.theme;
}
