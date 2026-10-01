export const count=n=>new Intl.NumberFormat('en-IN').format(n);
export const percent=(n,d)=>!d?'—':n>0&&n/d*100<.01?'<0.01%':(n/d*100).toFixed(2)+'%';
export const offsets={total:0,rural:3,urban:6};
export function selection(data,code='015000',residence='total'){
 if(!Object.hasOwn(data.labels,code))code='015000';if(!Object.hasOwn(offsets,residence))residence='total';
 const i=offsets[residence],row=data.areas['000'].rows[code],population=data.areas['000'].population[i];
 return {code,residence,label:data.labels[code],persons:row.values[i],males:row.values[i+1],females:row.values[i+2],population,share:percent(row.values[i],population),sourceRow:row.source_row};
}
export function districtRows(data,code,residence='total',sort='count',query=''){
 const s=selection(data,code,residence),i=offsets[s.residence],q=query.trim().toLocaleLowerCase();
 return Object.values(data.areas).filter(a=>a.code!=='000'&&a.name.toLocaleLowerCase().includes(q)).map(a=>{
  const row=a.rows[s.code],persons=row?row.values[i]:null,denominator=a.population[i];
  return {code:a.code,name:a.name,persons,males:row?row.values[i+1]:null,females:row?row.values[i+2]:null,population:denominator,share:persons===null?null:denominator?persons/denominator*100:null,distribution:persons===null?null:s.persons?persons/s.persons*100:null,sourceRow:row?.source_row??null};
 }).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='share'?(b.share??-1)-(a.share??-1)||a.name.localeCompare(b.name):(b.persons??-1)-(a.persons??-1)||a.name.localeCompare(b.name));
}
export function stateMultilingual(data,code){
 const entry=data.labels[code];if(!entry||entry.level!=='language_group')return null;
 return data.multilingualism[code]||null;
}
export function csvRows(rows,context){
 const safe=value=>'"'+String(value??'Not separately listed').replaceAll('"','""')+'"';
 const heading=context?'Year,Entry code,Entry label,Classification,Residence,':'';
 return [heading+'District,Persons,Males,Females,Population denominator,Share of district (%),Share of selected language in Odisha (%),C16 source row',...rows.map(r=>[...(context?[2011,context.code,context.label.label,context.label.level,context.residence]:[]),r.name,r.persons,r.males,r.females,r.population,r.share===null?null:r.share.toFixed(6),r.distribution===null?null:r.distribution.toFixed(6),r.sourceRow].map(safe).join(','))].join('\r\n');
}

export const districtSlug=area=>area.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const districtHref=area=>'/languages/districts/'+districtSlug(area)+'/';
export function districtBreakdown(data,code,residence='total'){
 if(code==='000'||!Object.hasOwn(data.areas,code))throw new RangeError('Unknown district');
 if(!Object.hasOwn(offsets,residence))residence='total';
 const area=data.areas[code],i=offsets[residence],population=area.population[i];
 const rows=Object.entries(area.rows).map(([code,row])=>({...data.labels[code],persons:row.values[i],males:row.values[i+1],females:row.values[i+2],share:percent(row.values[i],population),sourceRow:row.source_row})).filter(r=>r.persons>0).sort((a,b)=>b.persons-a.persons||a.code.localeCompare(b.code));
 return {area,residence,population,groups:rows.filter(r=>r.level==='language_group'),entries:rows.filter(r=>r.level==='mother_tongue')};
}
export function multilingualTotals(data){
 const totals=Object.values(data.multilingualism).reduce((t,m)=>({population:t.population+m.population[0],atLeastTwo:t.atLeastTwo+m.at_least_two_languages[0],three:t.three+m.three_languages[0]}),{population:0,atLeastTwo:0,three:0});
 return {...totals,exactlyTwoReported:totals.atLeastTwo-totals.three,noAdditionalReported:totals.population-totals.atLeastTwo};
}
