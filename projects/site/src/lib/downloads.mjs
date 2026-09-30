export function exportFilename(title,kind,extension,date=new Date().toISOString().slice(0,10)){
 const name=String(title||'odisha-journey').normalize('NFKC').replace(/[^\p{L}\p{M}\p{N}]+/gu,'-').replace(/^-|-$/g,'').slice(0,60)||'odisha-journey';
 const safeKind=String(kind).replace(/[^a-z0-9-]/g,'')||'export';
 const safeDate=/^\d{4}-\d{2}-\d{2}$/.test(date)?date:'undated';
 const ext=['json','html','txt'].includes(extension)?extension:'txt';
 return `${name}-${safeKind}-${safeDate}.${ext}`;
}
export function downloadFile(text,name,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
