import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {scan, compareBaseline, githubAnnotations} from '../src/core.mjs';
function fixture(t, body, resources={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-regression-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const dir=path.join(root,'demo'); fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir,'SKILL.md'),`---\nname: demo\ndescription: Test resource packaging.\n---\n${body}\n`);
  for(const [name,data] of Object.entries(resources)){const f=path.join(dir,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,data);}
  return {root,dir};
}
for(const [label,body,resources,rule] of [
  ['space-containing link','[guide](<references/my guide.md>)',{'references/my guide.md':'ok'},null],
  ['parent traversal','[escape](../outside.md)',{},'PATH_ESCAPE'],
  ['ordinary local link','[guide](guide.md)',{},'MISSING_REFERENCE'],
  ['query and anchor','[guide](references/guide.md?raw=1#intro)',{'references/guide.md':'ok'},null],
  ['external URL containing resource path','[web](https://example.com/references/guide.md)',{},null],
  ['parent directory case','[guide](references/guide.md)',{'References/guide.md':'ok'},'CASE_MISMATCH'],
  ['link title','[guide](references/guide.md "A title")',{'references/guide.md':'ok'},null],
  ['balanced parentheses','[guide](references/a(b).md)',{'references/a(b).md':'ok'},null],
  ['reference link','Read [guide][g].\n[g]: references/absent.md',{},'MISSING_REFERENCE'],
  ['encoded space','[guide](references/my%20guide.md)',{'references/my guide.md':'ok'},null],
  ['dynamic example','Read `references/*.md`.',{},null],
  ['absolute path','[guide](/tmp/guide.md)',{},'ABSOLUTE_REFERENCE'],
  ['windows absolute link','[guide](C:\\Users\\Example\\guide.md)',{},'ABSOLUTE_REFERENCE'],
  ['windows absolute link, escaped backslashes','[guide](C:\\\\Users\\\\Example\\\\guide.md)',{},'ABSOLUTE_REFERENCE'],
  ['inline resource','Read `scripts/check.py`.',{},'MISSING_REFERENCE'],
]) test(label,t=>{const {root}=fixture(t,body,resources);const r=scan(root);if(rule)assert.ok(r.findings.some(f=>f.rule===rule),JSON.stringify(r.findings));else assert.equal(r.summary.error,0,JSON.stringify(r.findings));});
test('baseline distinguishes same-named skills in different directories',t=>{
 const {root,dir}=fixture(t,'[missing](references/missing.md)');const before=scan(root);
 fs.mkdirSync(path.join(root,'other'));fs.cpSync(dir,path.join(root,'other','demo'),{recursive:true});
 assert.equal(compareBaseline(scan(root),before).comparison.new.length,1);
});
test('malformed baseline rejected',t=>{const {root}=fixture(t,'Hello');for(const bad of [{},null,{findings:[{}]},{tool:'other',findings:[]}])assert.throws(()=>compareBaseline(scan(root),bad),/baseline/i);});
test('symlinked SKILL.md is not read outside package',t=>{
 const {root,dir}=fixture(t,'Hello');fs.renameSync(path.join(dir,'SKILL.md'),path.join(root,'external.md'));
 fs.symlinkSync(path.join(root,'external.md'),path.join(dir,'SKILL.md'));
 assert.ok(scan(root).findings.some(f=>f.rule==='SYMLINK_ESCAPE'));
});
test('scans are deterministic',t=>{const {root}=fixture(t,'[a](references/no.md)');assert.deepEqual(scan(root),scan(root));});
test('annotation messages cannot inject workflow commands',()=>{const lines=githubAnnotations({findings:[{severity:'error',file:'a,b\n::error::x',line:1,rule:'TEST',message:'a\n::error::injected%'}]});assert.equal(lines.length,1);assert.ok(!lines[0].includes('\n'));assert.match(lines[0],/%0A/);});
for(const [label,description,expected] of [
 ['empty quoted description','"   "','DESCRIPTION_INVALID'],
 ['folded block with chomping','>-\n  A useful description',null],
 ['literal block with chomping','|-\n  A useful description',null],
 ['unquoted comment','A useful description # commentary',null],
 ['unsupported YAML alias','*description','FRONTMATTER_UNSUPPORTED'],
])test(label,t=>{const {root,dir}=fixture(t,'Hello');const f=path.join(dir,'SKILL.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('Test resource packaging.',description));const r=scan(root);if(expected)assert.ok(r.findings.some(f=>f.rule===expected));else assert.equal(r.summary.error,0);});
test('duplicate required field rejected',t=>{const {root,dir}=fixture(t,'Hello');const f=path.join(dir,'SKILL.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('name: demo','name: other\nname: demo'));assert.ok(scan(root).findings.some(f=>f.rule==='FRONTMATTER_DUPLICATE'));});
test('normalized local path is not a case mismatch',t=>{const {root}=fixture(t,'[guide](references/../guide.md)',{'guide.md':'ok'});assert.equal(scan(root).summary.error,0);});
test('CRLF and BOM supported',t=>{const {root,dir}=fixture(t,'Hello');const f=path.join(dir,'SKILL.md');fs.writeFileSync(f,'\uFEFF'+fs.readFileSync(f,'utf8').replaceAll('\n','\r\n'));assert.equal(scan(root).summary.error,0);});

test('baseline detects resolved findings and ignores line shifts',t=>{const {root,dir}=fixture(t,'[missing](references/missing.md)');const before=scan(root);const file=path.join(dir,'SKILL.md');fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('[missing]','\n\n[missing]'));assert.equal(compareBaseline(scan(root),before).comparison.new.length,0);fs.mkdirSync(path.join(dir,'references'));fs.writeFileSync(path.join(dir,'references','missing.md'),'ok');assert.equal(compareBaseline(scan(root),before).comparison.resolved.length,1);});

test('dangling SKILL.md symlink yields a deterministic diagnostic',t=>{
  const {root,dir}=fixture(t,'x');
  fs.rmSync(path.join(dir,'SKILL.md'));
  fs.symlinkSync(path.join(root,'nowhere.md'),path.join(dir,'SKILL.md'));
  const r=scan(root);
  assert.equal(r.summary.skills,1);
  assert.ok(r.findings.some(f=>f.rule==='SYMLINK_BROKEN'&&f.file==='demo/SKILL.md'),JSON.stringify(r.findings));
});
test('illustrative paths in markdown fences are ignored, but shell fences are still checked',t=>{
  const {root}=fixture(t,'```markdown\nSee references/example.md\n```\n\n```bash\npython scripts/missing.py\n```');
  const r=scan(root);
  assert.deepEqual(r.findings.map(f=>[f.rule,f.target]),[['MISSING_REFERENCE','scripts/missing.py']]);
});

test('link-like syntax in code is not a reference; real resources in code still are',t=>{
  const {root}=fixture(t,'Use `func f[T any](t T)` or `[x](y.md)`.\n\n```go\nfunc assertEqual[T comparable](t *testing.T, got T) {}\n```\n\nSee `scripts/real.py`.');
  const r=scan(root);
  assert.deepEqual(r.findings.map(f=>[f.rule,f.target]),[['MISSING_REFERENCE','scripts/real.py']]);
});
test('bare folder mentions are not dependencies, but files and subfolders are',t=>{
  const {root}=fixture(t,'Layout: scripts/ and references/ hold code.\nBundle assets/templates/ too.');
  const r=scan(root);
  assert.deepEqual(r.findings.map(f=>f.target),['assets/templates/']);
});

test('literal exclusions skip mirrored discovery but not similar siblings',t=>{
 const {root,dir}=fixture(t,'[missing](references/missing.md)');
 for(const name of ['mirror','mirror-copy']){fs.mkdirSync(path.join(root,name));fs.cpSync(dir,path.join(root,name,'demo'),{recursive:true});}
 const r=scan(root,{exclude:['mirror/']});assert.equal(r.summary.skills,2);assert.deepEqual(r.exclusions,['mirror']);
 assert.ok(r.skills.some(s=>s.file==='mirror-copy/demo/SKILL.md'));
});
test('excluded resource remains resolvable from included skill',t=>{
 const {root}=fixture(t,'[ok](references/ok.md)',{'references/ok.md':'ok'});
 assert.equal(scan(root,{exclude:['demo/references']}).summary.error,0);
});
test('exclusions cannot silently exclude root or escape it',t=>{
 const {root}=fixture(t,'Hello');for(const exclude of [['.'],[''],['../outside'],['demo/../demo'],['/tmp'],['C:\\tmp'],'demo'])assert.throws(()=>scan(root,{exclude}),/exclu/i);
});
test('baseline refuses changed discovery scope',t=>{
 const {root}=fixture(t,'Hello');assert.throws(()=>compareBaseline(scan(root,{exclude:['mirror']}),scan(root)),/exclu/i);
});
test('resource indexing preserves parent and nested skill collisions',t=>{
 const {root,dir}=fixture(t,'Hello',{'one.txt':'a','ONE.txt':'b','nested/SKILL.md':'---\nname: nested\ndescription: Test\n---\nHello','nested/two.txt':'a','nested/TWO.txt':'b'});
 if(fs.readdirSync(dir).filter(n=>n.toLowerCase()==='one.txt').length<2){t.skip('case-insensitive filesystem cannot hold a collision');return;}
 const findings=scan(root).findings.filter(f=>f.rule==='CASE_COLLISION');
 assert.equal(findings.filter(f=>f.skill==='demo').length,2);assert.equal(findings.filter(f=>f.skill==='nested').length,1);
});
test('parameterized resources are not literal missing files',t=>{
 const {root}=fixture(t,'Read `assets/snippets/{tool}.js` or [dynamic](references/%7Btopic%7D.md).');assert.equal(scan(root).summary.findings,0);
});
test('indented plain description does not swallow later metadata',t=>{
 const {root,dir}=fixture(t,'Hello');fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: demo\ndescription:\n  A multi-line plain\n  description for real tools.\nlicense: MIT\n---\nHello');assert.equal(scan(root).summary.error,0);
});
test('indented mappings and sequences are not accepted as strings',t=>{
 const {root,dir}=fixture(t,'Hello');for(const value of ['  text: nested','  - item']){
 fs.writeFileSync(path.join(dir,'SKILL.md'),`---\nname: demo\ndescription:\n${value}\n---\nHello`);assert.ok(scan(root).findings.some(f=>f.rule==='FRONTMATTER_UNSUPPORTED'));}
});
test('wrapped absolute-path instruction does not produce cwd warning',t=>{
 const {root}=fixture(t,"Run this skill's `scripts/task-done`\nby its absolute path, from the working tree.",{'scripts/task-done':'ok'});
 assert.equal(scan(root).findings.filter(f=>f.rule==='AMBIGUOUS_CWD').length,0);
});
test('separate absolute-path note does not suppress cwd warning',t=>{
 const {root}=fixture(t,'Run `scripts/task-done`.\n\nby its absolute path, from the working tree.',{'scripts/task-done':'ok'});
 assert.equal(scan(root).findings.filter(f=>f.rule==='AMBIGUOUS_CWD').length,1);
});

test('unicode lowercase skill names are accepted like the reference validator; uppercase and double hyphens are not',t=>{
  const mk=(folder,name)=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-name-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,folder));fs.writeFileSync(path.join(root,folder,'SKILL.md'),`---\nname: ${name}\ndescription: d\n---\nBody\n`);return scan(root).findings.map(f=>f.rule);};
  assert.deepEqual(mk('café-skill','café-skill'),[]);
  assert.deepEqual(mk('技能','技能'),[]);
  assert.deepEqual(mk('Demo','Demo'),['NAME_INVALID']);
  assert.deepEqual(mk('a--b','a--b'),['NAME_INVALID']);
});

test('over-long compatibility field is an error; a short one is fine',t=>{
  const mk=(compat)=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-compat-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,'demo'));fs.writeFileSync(path.join(root,'demo','SKILL.md'),`---\nname: demo\ndescription: d\ncompatibility: ${compat}\n---\nBody\n`);return scan(root).findings.map(f=>f.rule);};
  assert.deepEqual(mk('Needs Node 20'),[]);
  assert.deepEqual(mk('x'.repeat(501)),['COMPATIBILITY_INVALID']);
  assert.deepEqual(mk('x'.repeat(500)),[]);
});

test('bare folder names followed by punctuation are not dependencies',t=>{
  const {root}=fixture(t,'Creates scripts/, references/, and assets/. Also see assets/.');
  assert.deepEqual(scan(root).findings,[]);
});

test('placeholder link targets and output paths are not dependencies; real ones still are',t=>{
  const {root}=fixture(t,'Syntax: [text](url) and [x](URL).\nRun `tool -o assets/logo.svg` or `tool --output scripts/out.txt` or `tool > references/out.md`.\nBut read scripts/real.py and [doc](missing.md).');
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target).sort(),['missing.md','scripts/real.py']);
});
