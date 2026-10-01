import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const site=new URL('../',import.meta.url),config=JSON.parse(await readFile(new URL('editions/responsive-images.json',site),'utf8'));
const manifest={},report=[];
await mkdir(new URL('public/images/responsive/',site),{recursive:true});await mkdir(new URL('.astro/',site),{recursive:true});
for(const src of config.sources){
 if(!/^\/(?:assets|images)\/[a-zA-Z0-9/_.-]+$/.test(src)||src.includes('..'))throw Error('Invalid image path');
 const original=await readFile(new URL('public'+src,site));const meta=await sharp(original).metadata();
 const hash=createHash('sha256').update(original).update(JSON.stringify(config)).digest('hex').slice(0,16),variants=[];
 for(const width of [...new Set(config.widths.map(w=>Math.min(w,meta.width)))]){
  const {data,info}=await sharp(original).rotate().resize({width,withoutEnlargement:true}).webp({quality:config.quality,effort:5}).toBuffer({resolveWithObject:true});
  const path=`/images/responsive/${hash}-${info.width}.webp`;await writeFile(new URL('public'+path,site),data);
  variants.push({src:path,width:info.width,height:info.height,bytes:data.length});
 }
 manifest[src]={srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', ')};report.push({src,original_bytes:original.length,variants});
}
await writeFile(new URL('.astro/responsive-images.json',site),JSON.stringify(manifest));
await writeFile(new URL('.astro/responsive-image-report.json',site),JSON.stringify({transform:'Aspect-preserving resize and WebP encoding only. Originals and credit records retained.',images:report},null,2)+'\n');
console.log(`Prepared responsive variants for ${report.length} existing images.`);
