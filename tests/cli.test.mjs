import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const cli=path.resolve('src/cli.mjs');
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});
for(const args of [ ['bad'],['scan'],['scan','examples/valid','--format','xml'],['scan','examples/valid','--out','--strict'],['scan','examples/valid','--fail-on-new'],['scan','examples/valid','--wat'],['scan','missing-directory'] ])test(`invalid command ${args.join(' ')}`,()=>assert.equal(run(...args).status,2));
test('version',()=>{const r=run('--version');assert.equal(r.status,0);assert.match(r.stdout,/0\.2\.0/);});
test('help',()=>assert.equal(run('--help').status,0));
test('valid fixture',()=>assert.equal(run('scan','examples/valid').status,0));
test('broken fixture',()=>assert.equal(run('scan','examples/broken').status,1));
test('JSON stdout remains parseable with annotations',()=>{const r=run('scan','examples/broken','--format','json','--github-annotations');assert.equal(r.status,1);assert.equal(JSON.parse(r.stdout).tool,'skillpath-guard');assert.match(r.stderr,/::error file=examples\/broken\/demo-skill\/SKILL.md/);});
test('baseline workflow and invalid baseline',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'guard-cli-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const base=path.join(dir,'baseline.json');
 assert.equal(run('scan','examples/broken','--format','json','--out',base).status,1);
 assert.equal(run('scan','examples/broken','--baseline',base,'--fail-on-new','--strict').status,0);
 fs.writeFileSync(base,'{}');assert.equal(run('scan','examples/valid','--baseline',base).status,2);
});
test('strict only changes warning exit policy',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'guard-strict-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 const skill=path.join(dir,'demo');fs.mkdirSync(path.join(skill,'references'),{recursive:true});
 fs.writeFileSync(path.join(skill,'SKILL.md'),'---\nname: demo\ndescription: Test\n---\nRead `references/guide.md`.');fs.writeFileSync(path.join(skill,'references','guide.md'),'ok');
 assert.equal(run('scan',dir).status,0);assert.equal(run('scan',dir,'--strict').status,1);
});
test('CLI exclusions repeat and validate',()=>{
 const r=run('scan','examples','--exclude','broken','--exclude','unused','--format','json');assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).summary.skills,1);assert.deepEqual(JSON.parse(r.stdout).exclusions,['broken','unused']);
 assert.equal(run('scan','examples','--exclude','../outside').status,2);assert.equal(run('scan','examples','--exclude').status,2);
});
