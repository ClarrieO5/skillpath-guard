import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'guard-verify-'));
function check(args,expected=0){const r=spawnSync(process.execPath,args,{encoding:'utf8'});if(r.status!==expected)throw new Error(`${args.join(' ')}: expected ${expected}, got ${r.status}\n${r.stdout}\n${r.stderr}`);return r;}
try {
 check(['--test',...fs.readdirSync('tests').filter(f=>f.endsWith('.test.mjs')).sort().map(f=>path.join('tests',f))]);
 check(['src/cli.mjs','scan','examples/valid']);
 check(['src/cli.mjs','scan','examples/broken'],1);
 const baseline=path.join(temp,'baseline.json');
 check(['src/cli.mjs','scan','examples/broken','--format','json','--out',baseline],1);
 check(['src/cli.mjs','scan','examples/broken','--baseline',baseline,'--fail-on-new','--strict']);
 console.log('Verified tests, valid/broken exits, JSON output, and unchanged-baseline gate.');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
