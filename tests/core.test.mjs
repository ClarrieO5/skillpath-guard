import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {scan, compareBaseline, toMarkdown} from '../src/core.mjs';
const temp=()=>fs.mkdtempSync(path.join(os.tmpdir(),'skillpath-'));
function fixture(name,body,resources={}){
  const root=temp(); const dir=path.join(root,name);fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'SKILL.md'),`---\nname: ${name}\ndescription: A realistic example skill used for portability testing.\n---\n\n${body}\n`);
  for(const [rp,text] of Object.entries(resources)){const f=path.join(dir,rp);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,text)}
  return root;
}
function cleanup(root){fs.rmSync(root,{recursive:true,force:true})}
test('clean references are resolved from skill root',()=>{const root=fixture('demo-skill','See [guide](references/guide.md).',{'references/guide.md':'Guide'});try {const report=scan(root); assert.equal(report.summary.error,0);assert.equal(report.skills[0].references[0].status,'ok')}finally{cleanup(root)}});
test('missing target is an error',()=>{const root=fixture('demo-skill','See [guide](references/missing.md).');try{assert.ok(scan(root).findings.some(x=>x.rule==='MISSING_REFERENCE'))}finally{cleanup(root)}});
test('plain relative read instruction receives contextual warning',()=>{const root=fixture('demo-skill','Read `references/guide.md` before proceeding.',{'references/guide.md':'ok'});try{assert.ok(scan(root,{cwdHints:true}).findings.some(x=>x.rule==='AMBIGUOUS_CWD'))}finally{cleanup(root)}});
test('no skill produces explicit error',()=>{const root=temp();try{assert.ok(scan(root).findings.some(x=>x.rule==='NO_SKILLS'))}finally{cleanup(root)}});
test('frontmatter name must match folder',()=>{const root=fixture('demo-skill','Useful details.');const f=path.join(root,'demo-skill','SKILL.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('name: demo-skill','name: wrong-name'));try{assert.ok(scan(root).findings.some(x=>x.rule==='NAME_INVALID'))}finally{cleanup(root)}});
test('case mismatch is detected where supported',()=>{const root=fixture('demo-skill','See [guide](references/guide.md).',{'references/Guide.md':'ok'});try{const found=scan(root).findings;assert.ok(found.some(x=>x.rule==='CASE_MISMATCH'||x.rule==='MISSING_REFERENCE'))}finally{cleanup(root)}});
test('baseline comparison reports new findings',()=>{const root=fixture('demo-skill','See [a](references/a.md).',{'references/a.md':'ok'});try{const base=scan(root);fs.appendFileSync(path.join(root,'demo-skill','SKILL.md'),'\nSee [b](references/missing.md).');const r=compareBaseline(scan(root),base);assert.equal(r.comparison.new.length,1);assert.equal(r.comparison.resolved.length,0);assert.match(toMarkdown(r),/MISSING_REFERENCE/)}finally{cleanup(root)}});
test('out-of-directory symlink is flagged',()=>{const root=fixture('demo-skill','See [guide](references/escape.md).');const target=path.join(root,'outside.md');fs.writeFileSync(target,'outside');const symlink=path.join(root,'demo-skill','references','escape.md');fs.mkdirSync(path.dirname(symlink),{recursive:true});fs.symlinkSync(target,symlink);try{assert.ok(scan(root).findings.some(x=>x.rule==='SYMLINK_ESCAPE'))}finally{cleanup(root)}});
test('format is stable on valid example',()=>{const report=scan(path.resolve('examples/valid'));assert.equal(report.summary.error,0);assert.match(toMarkdown(report),/SkillPath Guard report/)});
