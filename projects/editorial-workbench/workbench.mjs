export function filterRecords(records,{query='',kind='',focus=''}={}){
 const q=query.trim().normalize('NFKC').toLocaleLowerCase();
 return records.filter(r=>{
  if(kind&&r.kind!==kind)return false;
  if(q&&!JSON.stringify(r).normalize('NFKC').toLocaleLowerCase().includes(q))return false;
  if(focus==='flags')return r.flags.length>0;
  if(focus==='page')return Boolean(r.public_route);
  if(focus==='unmapped')return r.kind!=='Source'&&!r.public_route;
  if(focus==='shared')return r.related_source_ids.length>0;
  return focus==='';
 });
}
