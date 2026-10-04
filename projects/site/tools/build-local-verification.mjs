import {readFileSync,writeFileSync} from 'node:fs';
import {renderVerificationPack} from '../src/lib/verification-pack.mjs';
const pack=JSON.parse(readFileSync(new URL('../../../kb/research/destinations/stone-sea-local-verification.json',import.meta.url),'utf8'));
writeFileSync(new URL('../public/assets/stone-sea-local-verification.txt',import.meta.url),renderVerificationPack(pack));
