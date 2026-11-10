#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {scan,compareBaseline,toMarkdown,githubAnnotations} from './core.mjs';
function usage(){console.log(`SkillPath Guard v0.2.2\n\nUsage:\n  node src/cli.mjs scan <directory> [--format text|json|md] [--out path]\n      [--exclude root-relative-path] [--baseline path-to-json] [--fail-on-new] [--strict] [--github-annotations]\n\nExamples:\n  npm test\n  node src/cli.mjs scan examples/valid\n  node src/cli.mjs scan examples/broken --format md\n  node src/cli.mjs scan examples/valid --format json --out report.json\n\nExit: 0 = success; 1 = errors (or warnings with --strict); 2 = command/configuration error.`)}
const a=process.argv.slice(2);
if(a.length===1 && a[0]==='--version'){console.log('0.2.2');process.exit(0)}
if(a.length===0||a.includes('--help')||a.includes('-h')) {usage(); process.exit(0)}
if(a[0]!=='scan'||!a[1]||a[1].startsWith('--')) {usage();process.exit(2)}
const exclude=[];
let format='text',out='',baselinePath='',strict=false,failOnNew=false,annotations=false;
for(let i=2;i<a.length;i++) {
  const opt=a[i];
  if(opt==='--format'||opt==='--out'||opt==='--baseline'||opt==='--exclude') {
    if(!a[i+1] || a[i+1].startsWith('--')) {console.error(`Missing value for ${opt}`);process.exit(2)}
    const value=a[++i]; if(opt==='--format')format=value; else if(opt==='--out')out=value; else if(opt==='--baseline')baselinePath=value; else exclude.push(value);
  } else if(opt==='--strict') strict=true;
  else if(opt==='--fail-on-new') failOnNew=true;
  else if(opt==='--github-annotations') annotations=true;
  else {console.error(`Unknown option: ${opt}`);process.exit(2)}
}
if(!['text','json','md'].includes(format)){console.error('Unsupported output format');process.exit(2)}
if(failOnNew&&!baselinePath){console.error('--fail-on-new needs --baseline');process.exit(2)}
try {
  let report=scan(a[1],{exclude});
  if(baselinePath) report=compareBaseline(report,JSON.parse(fs.readFileSync(baselinePath,'utf8')));
  let rendered;
  if(format==='json') rendered=JSON.stringify(report,null,2)+'\n';
  else if(format==='md') rendered=toMarkdown(report);
  else rendered=[`SkillPath Guard | ${report.summary.skills} skills | ${report.summary.error} errors | ${report.summary.warning} warnings`,...report.findings.map(f=>`${f.severity.toUpperCase()} ${f.rule} ${f.file}:${f.line} ${f.message}`),...(report.comparison?[`Baseline: ${report.comparison.new.length} new; ${report.comparison.resolved.length} resolved`]:[])].join('\n')+'\n';
  if(out){fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(out,rendered); console.log(`Saved report to ${out}`)} else process.stdout.write(rendered);
  if(annotations) githubAnnotations(report).forEach(a=>console.error(a));
  const findings=failOnNew?report.comparison.new:report.findings;
  const failed=findings.some(f=>f.severity==='error'||strict&&f.severity==='warning');
  process.exitCode=failed?1:0;
} catch(e) {console.error('SkillPath Guard failed:',e.message);process.exitCode=2}
