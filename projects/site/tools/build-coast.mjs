import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
for(const [command,args] of [['npm',['run','build']],['python3',['tools/finalize-edition.py']]]){
 const result=spawnSync(command,args,{cwd,stdio:'inherit',env:{...process.env,PUBLIC_UTKAL_EDITION:'coast',ASTRO_TELEMETRY_DISABLED:'1'}});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status||1);
}
