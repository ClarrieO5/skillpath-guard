import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {scan, compareBaseline, githubAnnotations, toMarkdown} from '../src/core.mjs';
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
 assert.equal(scan(root,{cwdHints:true}).findings.filter(f=>f.rule==='AMBIGUOUS_CWD').length,0);
});
test('separate absolute-path note does not suppress cwd warning',t=>{
 const {root}=fixture(t,'Run `scripts/task-done`.\n\nby its absolute path, from the working tree.',{'scripts/task-done':'ok'});
 assert.equal(scan(root,{cwdHints:true}).findings.filter(f=>f.rule==='AMBIGUOUS_CWD').length,1);
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

test('NAME_INVALID at the scan root explains clone-folder mismatch; nested skills get no hint',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'owner__humanizer-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.writeFileSync(path.join(root,'SKILL.md'),'---\nname: humanizer\ndescription: d\n---\nBody\n');
  fs.mkdirSync(path.join(root,'nested'));fs.writeFileSync(path.join(root,'nested','SKILL.md'),'---\nname: other\ndescription: d\n---\nBody\n');
  const f=scan(root).findings.filter(x=>x.rule==='NAME_INVALID');
  assert.equal(f.length,2);
  assert.match(f.find(x=>x.file==='SKILL.md').message,/scan root.*'humanizer'/);
  assert.doesNotMatch(f.find(x=>x.file!=='SKILL.md').message,/scan root/);
});

// False positives found while scanning 33 public skill repositories (2026-11-10).
test('placeholder segments cut a path short; the truncated prefix is not a dependency',t=>{
  const {root}=fixture(t,'Use `scripts/train_<variant>_example.py` or assets/sample_{name}.txt.\nMissing: `scripts/real.py`');
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target),['scripts/real.py']);
});
test('extensionless slash pairs in prose ("scripts/CI commands") are words, not files; code spans and links still count',t=>{
  const {root}=fixture(t,'Preserve repository scripts/CI commands and links to assets/code.\nRun `scripts/lint --report`.\nSee [x](references/guide).');
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target).sort(),['references/guide','scripts/lint']);
});
test('an extensionless reference resolves to a single file with that stem (TS import, table entry)',t=>{
  const {root}=fixture(t,"```ts\nimport { buildCard } from './assets/card-builder';\n```\n| `references/open-coding` | notes |\n| `references/dup` | ambiguous |",{'assets/card-builder.ts':'x','references/open-coding.md':'x','references/dup.md':'x','references/dup.txt':'x'});
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target),['references/dup']);
});
test('a file in another named skill is a cross-skill mention, not a missing dependency',t=>{
  const {root}=fixture(t,"Route to `other-skill`; its\n`references/native.md` covers iOS.\nThe `other-skill` skill's `references/absent.md` is missing.\n\nOwn file: `references/native.md` alone is not enough without a mention.",{});
  const o=path.join(root,'other-skill');fs.mkdirSync(path.join(o,'references'),{recursive:true});
  fs.writeFileSync(path.join(o,'SKILL.md'),'---\nname: other-skill\ndescription: d\n---\nBody\n');fs.writeFileSync(path.join(o,'references','native.md'),'x');
  const missing=scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>`${f.line}:${f.target}`);
  assert.deepEqual(missing,['7:references/absent.md','9:references/native.md']);
});
test('a dangling symlink inside a skills/ folder is a broken skill link',t=>{
  if(process.platform==='win32')return t.skip('symlink creation needs privileges on Windows');
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-skilllink-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const skills=path.join(root,'plugin','skills');fs.mkdirSync(path.join(root,'real','ok'),{recursive:true});fs.mkdirSync(skills,{recursive:true});
  fs.writeFileSync(path.join(root,'real','ok','SKILL.md'),'---\nname: ok\ndescription: d\n---\nBody\n');
  fs.symlinkSync('../../real/ok',path.join(skills,'ok'));fs.symlinkSync('../../real/gone',path.join(skills,'gone'));
  fs.symlinkSync('../real/gone',path.join(root,'plugin','unrelated-link'));
  const f=scan(root).findings.filter(x=>x.rule==='SYMLINK_BROKEN');
  assert.deepEqual(f.map(x=>x.file),['plugin/skills/gone']);
  assert.match(f[0].message,/real\/gone/);
});
// Found re-scanning 20 public repositories (2026-11-10); see docs/CORPUS_VALIDATION.md, "Round 3".
test('GFM footnote definitions are not link reference definitions; paths inside them are still checked',t=>{
  const {root}=fixture(t,'A claim.[^1] Another.[^note]\n\n[^1]: GitHub Blog. (2022). "Mermaid." https://github.blog/x\n[^note]: Mermaid. See references/gone.md for details.\n[g]: references/absent.md');
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target).sort(),['references/absent.md','references/gone.md']);
});
test('a :line or :/container suffix is not part of the file name',t=>{
  const {root}=fixture(t,'Report: `scripts/helper.py:42`, scripts/helper.py:10:5 and `scripts/helper.py:3-9`.\n```yaml\nvolumes:\n  - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql\n```\nAlso `scripts/gone.py:12`.',{'scripts/helper.py':'x'});
  assert.deepEqual(scan(root).findings.filter(f=>f.rule==='MISSING_REFERENCE').map(f=>f.target).sort(),['scripts/gone.py','scripts/init.sql']);
});
test('root-relative web routes in links are not machine paths; filesystem-looking ones still are',t=>{
  const {root}=fixture(t,'Learn more about [analytics](/features/analytics), [home](/), [plans](/pricing#plans).\n[a](/Users/alice/notes) [b](/home/bob/x) [c](/references/guide.md) [d](/srv/skills/scripts/run) [e](/workspaces/repo/tool)');
  const f=scan(root).findings;
  assert.deepEqual(f.filter(x=>x.rule==='ABSOLUTE_REFERENCE').map(x=>x.target),['/Users/alice/notes','/home/bob/x','/references/guide.md','/srv/skills/scripts/run','/workspaces/repo/tool']);
  assert.equal(f.filter(x=>x.line===5).length,0);
});
// Adoption audit (2026-11-10): first scans of 12 public skill repositories; see docs/ADOPTION_AUDIT_2026-11.md.
test('AMBIGUOUS_CWD is opt-in: the Agent Skills spec recommends skill-relative paths',t=>{
  const {root}=fixture(t,'See [the reference guide](references/REFERENCE.md) for details.\nRead `references/REFERENCE.md` before proceeding.',{'references/REFERENCE.md':'ok'});
  const r=scan(root);
  assert.equal(r.summary.warning,0,JSON.stringify(r.findings));
  assert.deepEqual(r.options,{cwdHints:false,allowShared:false});
  assert.equal(scan(root,{cwdHints:true}).findings.filter(f=>f.rule==='AMBIGUOUS_CWD').length,1);
});
test('--allow-shared downgrades only escaping links whose target exists inside the scan root',t=>{
  const {root}=fixture(t,'Shared: [s](../shared/style.md)\nGone: [g](../shared/gone.md)\nOutside: [o](../../outside.md)\nLocal: [l](references/absent.md)');
  fs.mkdirSync(path.join(root,'shared'));fs.writeFileSync(path.join(root,'shared','style.md'),'x');
  fs.writeFileSync(path.join(path.dirname(root),'outside.md'),'x');t.after(()=>fs.rmSync(path.join(path.dirname(root),'outside.md'),{force:true}));
  const pick=r=>r.findings.map(f=>`${f.line}:${f.rule}:${f.severity}`);
  assert.deepEqual(pick(scan(root)),['5:PATH_ESCAPE:error','6:PATH_ESCAPE:error','7:PATH_ESCAPE:error','8:MISSING_REFERENCE:error']);
  const shared=scan(root,{allowShared:true});
  assert.deepEqual(pick(shared),['5:SHARED_REFERENCE:warning','6:PATH_ESCAPE:error','7:PATH_ESCAPE:error','8:MISSING_REFERENCE:error']);
  assert.match(shared.findings[0].message,/shared\/style\.md/);
  const plain=scan(root).findings;
  assert.match(plain[0].message,/exists at shared\/style\.md.*--allow-shared/);
  assert.doesNotMatch(plain[1].message,/--allow-shared/);
});
test('--allow-shared does not accept a symlink that resolves outside the scan root',t=>{
  if(process.platform==='win32')return t.skip('symlink creation needs privileges on Windows');
  const {root}=fixture(t,'[s](../link.md)');
  const outside=fs.mkdtempSync(path.join(os.tmpdir(),'guard-out-'));t.after(()=>fs.rmSync(outside,{recursive:true,force:true}));
  fs.writeFileSync(path.join(outside,'x.md'),'x');fs.symlinkSync(path.join(outside,'x.md'),path.join(root,'link.md'));
  assert.deepEqual(scan(root,{allowShared:true}).findings.map(f=>f.rule),['PATH_ESCAPE']);
});
test('ignore comments silence findings on their line only, and are counted',t=>{
  const {root}=fixture(t,[
    'Example: `scripts/your_script.py` <!-- skillpath-guard-ignore -->',
    '<!-- skillpath-guard-ignore-next-line -->',
    'Create [a file](references/new-notes.md) for the user.',
    'Still checked: [x](references/absent.md)',
    'Mentioning <!-- skillpath-guard-ignore-next-line --> mid-line does not skip the next line: `scripts/also-absent.sh`',
    '[y](references/next-absent.md)',
  ].join('\n'));
  const r=scan(root);
  assert.deepEqual(r.findings.map(f=>f.target),['references/absent.md','scripts/also-absent.sh','references/next-absent.md']);
  assert.equal(r.summary.suppressed,2);
  assert.match(toMarkdown(r),/2 finding\(s\) silenced/);
});
test('Markdown report caps rows for GitHub job summaries',()=>{
  const findings=Array.from({length:503},(_,i)=>({rule:'MISSING_REFERENCE',severity:'error',file:'a/SKILL.md',line:i+1,message:'m'}));
  const md=toMarkdown({summary:{skills:1,error:503,warning:0},findings});
  assert.equal(md.split('\n').filter(l=>l.startsWith('| error')).length,500);
  assert.match(md,/3 more finding\(s\) not shown/);
});
test('npm package ships the tool, not internal drafts or third-party patches',()=>{
  const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.ok(pkg.files.includes('src/'));
  assert.ok(!pkg.files.some(f=>f==='docs/'||f.startsWith('docs/drafts')||f.startsWith('docs/patches')),JSON.stringify(pkg.files));
  assert.equal(pkg.bin['skillpath-guard'],'src/cli.mjs');
});
test('annotation message keeps : and , readable while properties stay escaped',()=>{
  const [line]=githubAnnotations({findings:[{severity:'error',file:'dir:x/a,b.md',line:3,rule:'T:R',message:'Referenced file does not exist: a/b, c 100%'}]});
  assert.equal(line,'::error file=dir%3Ax/a%2Cb.md,line=3,title=T%3AR::Referenced file does not exist: a/b, c 100%25');
});
test('package metadata is publishable and consistent with the CLI',async()=>{
  const {execFileSync}=await import('node:child_process');
  const root=new URL('..',import.meta.url);
  const pkg=JSON.parse(fs.readFileSync(new URL('package.json',root),'utf8'));
  assert.equal(pkg.name,'skillpath-guard');
  assert.notEqual(pkg.private,true,'private:true blocks npm publish');
  assert.equal(pkg.license,'MIT');
  assert.equal(pkg.engines.node,'>=20');
  assert.equal(pkg.publishConfig?.access,'public');
  assert.match(pkg.repository.url,/ClarrieO5\/skillpath-guard\.git$/);
  assert.equal(pkg.dependencies,undefined);
  assert.equal(pkg.devDependencies,undefined);
  for(const s of ['preinstall','install','postinstall','prepare'])assert.equal(pkg.scripts[s],undefined,`install-time script ${s} must not exist`);
  assert.match(pkg.scripts.prepublishOnly,/verify/);
  for(const f of pkg.files)assert.ok(fs.existsSync(new URL(f,root)),`files entry missing: ${f}`);
  const cli=fs.readFileSync(new URL(pkg.bin['skillpath-guard'],root),'utf8');
  assert.ok(cli.startsWith('#!/usr/bin/env node'));
  const out=execFileSync(process.execPath,[new URL('src/cli.mjs',root).pathname.replace(/^\/([A-Za-z]:)/,'$1'),'--version'],{encoding:'utf8'}).trim();
  assert.equal(out,pkg.version);
});
test('release version agrees across package, CLI, JSON report, workflow pins and README',async()=>{
  const {execFileSync}=await import('node:child_process');
  const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
  const v=JSON.parse(read('package.json')).version;
  assert.match(read('src/cli.mjs'),new RegExp(`console\\.log\\('${v.replaceAll('.','\\.')}'\\)`));
  assert.ok(read('src/cli.mjs').includes(`SkillPath Guard v${v}`));
  assert.ok(read('src/core.mjs').includes(`version:'${v}'`));
  const rc=read('.github/workflows/release-check.yml');
  assert.ok(rc.includes(`skillpath-guard@v${v}`)&&rc.includes(`--branch v${v}`)&&rc.includes(`= "${v}"`));
  const readme=read('README.md');
  for(const s of [`releases/tag/v${v}`,`skillpath-guard@${v} scan`,`#v${v} scan`,`ClarrieO5/skillpath-guard@v${v}`])assert.ok(readme.includes(s),`README lacks ${s}`);
  assert.ok(read('docs/CHANGELOG.md').includes(`## ${v} `));
  assert.ok(fs.existsSync(new URL(`../docs/RELEASE_NOTES_v${v}.md`,import.meta.url)));
});
function writeSkill(t,frontmatter,dirName='demo'){
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-fm-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const dir=path.join(root,dirName);fs.mkdirSync(dir);fs.writeFileSync(path.join(dir,'SKILL.md'),`---\n${frontmatter}\n---\nBody.\n`);return root;
}
test('unterminated quoted frontmatter value is reported (skills-ref rejects it as invalid YAML)',t=>{
  const root=writeSkill(t,'name: demo\ndescription: "unterminated');
  const f=scan(root).findings.find(x=>x.rule==='FRONTMATTER_UNSUPPORTED');
  assert.ok(f,'expected FRONTMATTER_UNSUPPORTED');assert.match(f.message,/Unterminated quoted string for description/);assert.equal(f.line,3);
  const single=writeSkill(t,"name: demo\ndescription: 'it''s fine but 'broken");
  assert.ok(!scan(single).findings.some(x=>x.message.includes('Unterminated')),'escaped single quotes and later quotes are not unterminated');
});
test('multi-line and escaped quoted frontmatter values are accepted',t=>{
  const root=writeSkill(t,'name: demo\ndescription: "Does a thing,\n  then another \\" thing."\nlicense: \'it\'\'s MIT\'');
  const r=scan(root);assert.equal(r.summary.error,0,JSON.stringify(r.findings));
});
test('NAME_INVALID message names the actual value and the failed check',t=>{
  const msg=(fm,dir)=>scan(writeSkill(t,fm,dir)).findings.find(x=>x.rule==='NAME_INVALID')?.message;
  assert.match(msg('name: other\ndescription: d','demo'),/^name 'other' does not match the folder name 'demo'/);
  assert.match(msg('name: Demo\ndescription: d','demo'),/contains uppercase letters/);
  assert.match(msg('name: de--mo\ndescription: d','de--mo'),/single hyphens/);
  assert.match(msg(`name: ${'a'.repeat(65)}\ndescription: d`,'a'.repeat(65)),/is 65 characters \(maximum 64\)/);
  assert.equal(msg('name: demo\ndescription: d','demo'),undefined);
});
test('DESCRIPTION_INVALID and COMPATIBILITY_INVALID messages include the measured length',t=>{
  const r=scan(writeSkill(t,`name: demo\ndescription: ${'x'.repeat(1100)}\ncompatibility: ${'y'.repeat(600)}`));
  assert.ok(r.findings.some(f=>f.rule==='DESCRIPTION_INVALID'&&/is 1100 characters/.test(f.message)));
  assert.ok(r.findings.some(f=>f.rule==='COMPATIBILITY_INVALID'&&/is 600 characters/.test(f.message)));
  assert.ok(scan(writeSkill(t,'name: demo\nmetadata: x')).findings.some(f=>f.rule==='DESCRIPTION_INVALID'&&/missing or empty/.test(f.message)));
});
test('v0.3.2 baselines stay valid after message rewording of metadata rules',t=>{
  const root=writeSkill(t,'name: other\ndescription: d','demo');const cur=scan(root);
  const old=JSON.parse(JSON.stringify(cur));for(const f of old.findings)if(f.rule==='NAME_INVALID')f.message="name must match folder 'demo' and contain 1-64 lowercase letters, digits or single hyphens (no leading or trailing hyphen).";
  assert.equal(compareBaseline(cur,old).comparison.new.length,0);
});
test('action.yml shell: boolean inputs are case-insensitive and invalid values fail loudly',{skip:process.platform==='win32'&&'bash script, covered by the Linux/macOS matrix and the hosted action smoke test'},async()=>{
  const {spawnSync}=await import('node:child_process');
  const yml=fs.readFileSync(new URL('../action.yml',import.meta.url),'utf8');
  const script=yml.slice(yml.indexOf('run: |\n')+7).replace(/^ {8}/gm,'').replaceAll('${{ github.action_path }}',new URL('..',import.meta.url).pathname.replace(/\/$/,''));
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guard-action-'));const dir=path.join(root,'demo');fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: demo\ndescription: d\n---\n[x](references/missing.md)\n');
  const sh=fs.mkdtempSync(path.join(os.tmpdir(),'guard-action-sh-'));fs.writeFileSync(path.join(sh,'run.sh'),script);
  const run=env=>spawnSync('bash',[path.join(sh,'run.sh')],{env:{PATH:process.env.PATH,SPG_PATH:root,SPG_BASELINE:'',SPG_STRICT:'',SPG_EXCLUDE:'',SPG_ALLOW_SHARED:'',SPG_CWD_HINTS:'',SPG_SUMMARY:'false',...env},encoding:'utf8'});
  try{
    assert.equal(run({}).status,1,'a missing reference fails by default');
    assert.equal(run({SPG_ALLOW_SHARED:'True'}).status,1);
    const bad=run({SPG_STRICT:'yes'});assert.equal(bad.status,2);assert.match(bad.stderr,/Input 'strict' must be 'true' or 'false', got 'yes'/);
    // "True" must really enable the flag: with a shared (escaping, existing) link, allow-shared turns the error into a warning.
    fs.writeFileSync(path.join(root,'shared.md'),'ok');fs.writeFileSync(path.join(dir,'SKILL.md'),'---\nname: demo\ndescription: d\n---\n[x](../shared.md)\n');
    assert.equal(run({}).status,1);assert.equal(run({SPG_ALLOW_SHARED:'True'}).status,0);assert.equal(run({SPG_ALLOW_SHARED:'TRUE',SPG_STRICT:'true'}).status,1);
  }finally{fs.rmSync(root,{recursive:true,force:true});fs.rmSync(sh,{recursive:true,force:true});}
});
