export const storySlots = ['place', 'taste', 'life'];
export function odishaDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
const dateValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
export function validateStorySelection(pool, pins = []) {
  const ids = new Set();
  for (const entry of pool) {
    if (!entry.href?.startsWith('/') || ids.has(entry.href) || !storySlots.includes(entry.slot)) throw Error('Invalid or duplicate featured story');
    ids.add(entry.href);
    if ((entry.preferred_months || []).some(m => !Number.isInteger(m) || m < 1 || m > 12)) throw Error('Invalid preferred month');
  }
  for (const slot of storySlots) if (!pool.some(e => e.slot === slot)) throw Error('Missing featured story slot: ' + slot);
  for (const pin of pins) {
    if (!pool.some(e => e.href === pin.href && e.slot === pin.slot)) throw Error('Pin must reference an eligible story in its slot');
    if (!dateValid(pin.expires) || (pin.starts && (!dateValid(pin.starts) || pin.starts > pin.expires))) throw Error('Pin requires valid dates and an expiry');
  }
  for (let i=0;i<pins.length;i++) for (const other of pins.slice(i+1)) {
    const pin=pins[i];
    if (pin.slot === other.slot && (pin.starts || '0000-01-01') <= other.expires && (other.starts || '0000-01-01') <= pin.expires) throw Error('Overlapping pins in one slot');
  }
}
export function cleanStoryHistory(value, pool, limit = 18) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(pool.map(e => e.href));
  return [...new Set(value.filter(href => typeof href === 'string' && valid.has(href)))].slice(0,limit);
}
export function chooseStoryTrio(pool, {pins = [], history = [], day = odishaDay(), random = Math.random} = {}) {
  const selected=[];
  const recent=cleanStoryHistory(history,pool);
  const month=Number(day.slice(5,7));
  for (const slot of storySlots) {
    const pin=pins.find(p=>p.slot===slot && (!p.starts || p.starts<=day) && p.expires>=day);
    let candidates=pool.filter(e=>e.slot===slot && !selected.some(s=>s.href===e.href));
    if (pin) candidates=candidates.filter(e=>e.href===pin.href);
    else {
      // Prefer unseen stories; if the pool is exhausted, avoid the previous trio.
      const unseen=candidates.filter(e=>!recent.includes(e.href));
      const notLast=candidates.filter(e=>!recent.slice(0,3).includes(e.href));
      candidates=unseen.length?unseen:notLast.length?notLast:candidates;
    }
    if (!candidates.length) throw Error('No eligible story for ' + slot);
    const weights=candidates.map(e=>{
      let weight=1;
      if (e.preferred_months?.includes(month)) weight*=2;
      if (slot==='taste' && e.regions?.some(region=>region!=='Across Odisha' && selected[0].regions?.includes(region))) weight*=3;
      return weight;
    });
    let point=random()*weights.reduce((a,b)=>a+b,0);
    let choice=candidates[candidates.length-1];
    for (let i=0;i<candidates.length;i++) {point-=weights[i];if(point<0){choice=candidates[i];break;}}
    selected.push(choice);
  }
  return selected;
}
