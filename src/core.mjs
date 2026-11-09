/** SkillPath Guard: deterministic, offline diagnostics for Agent Skills packages.
 * This is NOT a complete YAML parser, behavioural evaluator or runtime emulator.
 */
import fs from 'node:fs';
import path from 'node:path';
import {findReferenceTokens, sanitizeReference} from './references.mjs';

const IGNORED = new Set(['.git', 'node_modules', '.next', 'dist', 'build', '.DS_Store']);
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeSlash(s) { return s.replaceAll('\\', '/'); }
function rel(base, file) { return normalizeSlash(path.relative(base, file)) || '.'; }
function pushFinding(out, {rule, severity, file, line=1, message, target='', skill=''}) {
  out.push({rule, severity, file, line, message, target, skill});
}

function listFiles(directory) {
  const out = [];
  const todo = [directory];
  const seen = new Set();
  while (todo.length) {
    const dir = todo.pop();
    let real;
    try { real = fs.realpathSync(dir); } catch { continue; }
    if (seen.has(real)) continue;
    seen.add(real);
    for (const entry of fs.readdirSync(dir, {withFileTypes: true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      if (IGNORED.has(entry.name)) continue;
      const candidate = path.join(dir, entry.name);
      if (entry.isDirectory()) todo.push(candidate);
      else if (entry.isFile() || entry.isSymbolicLink()) out.push(candidate);
    }
  }
  return out.sort();
}

function parseFrontmatter(content) {
  const lines = content.replaceAll('\r\n', '\n').split('\n');
  if (lines[0]?.trim() !== '---') return {fields: {}, end: -1};
  const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
  if (end < 0) return {fields: {}, end: -1};
  const fields = {};
  const problems=[];
  for (let i=1; i<end; i++) {
    const match = lines[i].match(/^([a-z][\w-]*):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if(Object.hasOwn(fields,match[1]))problems.push({rule:'FRONTMATTER_DUPLICATE',line:i+1,message:`Duplicate frontmatter field: ${match[1]}`});
    if(!value.startsWith('\"') && !value.startsWith("'"))value=value.replace(/\s+#.*$/,'');
    if(['name','description'].includes(match[1]) && /^(?:[&*{\[]|!!)/.test(value))problems.push({rule:'FRONTMATTER_UNSUPPORTED',line:i+1,message:`Unsupported YAML for ${match[1]}; use a plain, quoted, or block string.`});
    if (/^[>|][+-]?$/.test(value)) {
      const block = [];
      while (i+1<end && (/^\s+/.test(lines[i+1]) || !lines[i+1].trim())) {
        const next = lines[++i]; if (next.trim()) block.push(next.trim());
      }
      value = block.join(value.startsWith('>')?' ':'\n');
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1,-1);
    fields[match[1]] = value;
  }
  return {fields, end, problems};
}

function findSameNameDifferentCase(base, reference) {
  let current=base;
  for(const part of reference.split('/').filter(Boolean)) {
    if(part==='.')continue;
    const entries=fs.readdirSync(current).sort();
    const match=entries.includes(part)?part:entries.find(n=>n.toLowerCase()===part.toLowerCase());
    if(!match)return null;
    current=path.join(current,match);
    // Never enumerate directories reached through an out-of-package symlink.
    if(!insideDirectory(fs.realpathSync(base),fs.realpathSync(current)))return null;
  }
  return current;
}
function insideDirectory(parent, candidate) {
  const p = path.relative(parent, candidate);
  return p === '' || (p !== '..' && !p.startsWith(`..${path.sep}`) && !path.isAbsolute(p));
}
function lineHasCwdSensitiveInstruction(line, reference) {
  const verbs = /\b(read|open|view|cat|run|execute|load|inspect|source|import)\b/i;
  return verbs.test(line) && line.includes(reference) && !/\b(absolute path|skill directory|skill root|base directory|resolve against)\b/i.test(line);
}

export function scan(rootInput) {
  const root = path.resolve(rootInput);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Directory not found: ${root}`);
  const files = listFiles(root);
  const skillFiles = files.filter(p => path.basename(p) === 'SKILL.md');
  const findings = [];
  const skills = [];
  if (!skillFiles.length) pushFinding(findings, {rule:'NO_SKILLS', severity:'error', file:'.', message:'No SKILL.md found in target directory.'});
  for (const filename of skillFiles) {
    const skillDir = path.dirname(filename);
    const skillName = path.basename(skillDir);
    const relativeFile = rel(root, filename);
    let realFile;
    try { realFile = fs.realpathSync(filename); } catch { realFile = null; }
    if (!realFile) {
      skills.push({name:skillName,file:relativeFile,references:[]});
      pushFinding(findings,{rule:'SYMLINK_BROKEN',severity:'error',file:relativeFile,skill:skillName,message:'SKILL.md is a dangling symlink or cannot be resolved; content was not read.'});
      continue;
    }
    if (!insideDirectory(fs.realpathSync(skillDir), realFile)) {
      skills.push({name:skillName,file:relativeFile,references:[]});
      pushFinding(findings,{rule:'SYMLINK_ESCAPE',severity:'error',file:relativeFile,skill:skillName,message:'SKILL.md resolves outside its skill directory; content was not read.'});
      continue;
    }
    const text = fs.readFileSync(filename,'utf8').replace(/^\uFEFF/,'');
    const lines = text.replaceAll('\r\n','\n').split('\n');
    const {fields, end, problems=[]} = parseFrontmatter(text);
    for(const problem of problems)pushFinding(findings,{...problem,severity:'error',file:relativeFile,skill:skillName});
    const edges = [];
    const seenRefs = new Set();
    skills.push({name:skillName, file:relativeFile, references:edges});
    if (end<0) pushFinding(findings, {rule:'FRONTMATTER_MISSING',severity:'error',file:relativeFile,skill:skillName,message:'SKILL.md requires opening and closing --- frontmatter.'});
    if (!fields.name) pushFinding(findings, {rule:'NAME_MISSING',severity:'error',file:relativeFile,skill:skillName,message:'Frontmatter is missing name.'});
    else if (fields.name.length>64 || !SKILL_NAME.test(fields.name) || fields.name!==skillName) pushFinding(findings,{rule:'NAME_INVALID',severity:'error',file:relativeFile,skill:skillName,message:`name must match folder '${skillName}' and contain 1-64 lowercase alphanumeric/hyphen characters.`});
    if (!fields.description?.trim() || fields.description.length>1024) pushFinding(findings,{rule:'DESCRIPTION_INVALID',severity:'error',file:relativeFile,skill:skillName,message:'description must be non-empty and at most 1024 characters.'});
    const bodyStart = end<0 ? 0 : end+1;
    if (lines.slice(bodyStart).join('').trim().length===0) pushFinding(findings,{rule:'BODY_EMPTY',severity:'warning',file:relativeFile,skill:skillName,message:'The skill has no instructions after frontmatter.'});
    let fence=null; // {marker, illustrative}
    for (let lineNo=bodyStart; lineNo<lines.length; lineNo++) {
      const line = lines[lineNo];
      const fenceMatch=line.match(/^\s{0,3}(`{3,}|~{3,})\s*([\w-]*)/);
      if (fence) { if (fenceMatch && fenceMatch[1][0]===fence.marker[0] && fenceMatch[1].length>=fence.marker.length && !line.replace(/^\s{0,3}[`~]+/,'').trim()) fence=null; else if (fence.illustrative) continue; }
      else if (fenceMatch) { fence={marker:fenceMatch[1],illustrative:['markdown','md'].includes(fenceMatch[2].toLowerCase())}; if (fence.illustrative) continue; }
      const tokens = findReferenceTokens(line);
      for (const token of tokens) {
        const reference = sanitizeReference(token.value,token.source);
        if (!reference) continue;
        const tokenKey=`${lineNo}:${reference}`;
        if (seenRefs.has(tokenKey)) continue;
        seenRefs.add(tokenKey);
        const candidate = path.resolve(skillDir, reference);
        const edge = {from:relativeFile, target:reference, line:lineNo+1, status:'ok'};
        if (/^(?:[a-z]:[\\/]|[\\/]|~)/i.test(reference)) {
          edge.status='absolute';
          pushFinding(findings,{rule:'ABSOLUTE_REFERENCE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Machine-specific absolute reference: ${reference}`});
        } else if (!insideDirectory(skillDir,candidate)) {
          edge.status='escape';
          pushFinding(findings,{rule:'PATH_ESCAPE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Reference escapes skill directory: ${reference}`});
        } else {
          let alternate=null;
          try { alternate=findSameNameDifferentCase(skillDir,reference); } catch {}
          if (alternate && rel(skillDir,alternate)!==path.posix.normalize(reference).replace(/\/$/,'')) {
            edge.status='case-mismatch';
            pushFinding(findings,{rule:'CASE_MISMATCH',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Case mismatch for ${reference}; found ${rel(skillDir,alternate)}`});
          } else if (!fs.existsSync(candidate)) {
          edge.status=alternate?'case-mismatch':'missing';
          pushFinding(findings,{rule:alternate?'CASE_MISMATCH':'MISSING_REFERENCE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:alternate?`Case mismatch for ${reference}; found ${rel(skillDir,alternate)}`:`Referenced file does not exist: ${reference}`});
        } else {
          try {
            const realSkill = fs.realpathSync(skillDir);
            const realTarget = fs.realpathSync(candidate);
            if (!insideDirectory(realSkill, realTarget)) {
              edge.status='symlink-escape';
              pushFinding(findings,{rule:'SYMLINK_ESCAPE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Symlink resolves outside skill directory: ${reference}`});
            }
          } catch {}
        }
        }
        edges.push(edge);
        if (!['absolute','escape','symlink-escape'].includes(edge.status) && lineHasCwdSensitiveInstruction(line, token.value)) pushFinding(findings,{rule:'AMBIGUOUS_CWD',severity:'warning',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Instruction uses a relative resource path (${reference}); some agents resolve paths from the workspace instead of the skill directory. Verify with the target runtime.`});
      }
    }
    const skillFilesOnly=files.filter(p=>insideDirectory(skillDir,p) && p!==filename);
    const lowerMap = new Map();
    for (const file of skillFilesOnly) {
      const rp=rel(skillDir,file);
      const key=rp.toLowerCase();
      const other=lowerMap.get(key);
      if (other && other!==rp) pushFinding(findings,{rule:'CASE_COLLISION',severity:'warning',file:relativeFile,skill:skillName,target:rp,message:`Two resources differ only by letter case: ${other} and ${rp}`});
      else lowerMap.set(key,rp);
    }
  }
  findings.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line||a.rule.localeCompare(b.rule));
  const counts={error:findings.filter(f=>f.severity==='error').length, warning:findings.filter(f=>f.severity==='warning').length};
  return {tool:'skillpath-guard', version:'0.1.0', root, summary:{skills:skills.length, findings:findings.length, ...counts}, skills, findings, limitations:['Heuristic resource detection may produce false positives or miss references in unusual Markdown.','Static analysis cannot prove how an individual AI agent will resolve a file at runtime.','Frontmatter reading covers common scalar fields; this is not a complete YAML implementation.']};
}

export function fingerprint(f) { return JSON.stringify([f.rule,f.severity,f.file,f.target||'',f.message]); }
export function compareBaseline(report,baseline) {
  if (!baseline || baseline.tool!=='skillpath-guard' || !Array.isArray(baseline.findings) || baseline.findings.some(f=>!f || !['error','warning'].includes(f.severity) || !['rule','file','message'].every(k=>typeof f[k]==='string') || (f.target!==undefined && typeof f.target!=='string'))) throw new Error('Invalid baseline: expected a SkillPath Guard JSON report with valid findings.');
  const current=new Set(report.findings.map(fingerprint));
  const old=new Set((baseline.findings||[]).map(fingerprint));
  return {...report, comparison:{new:report.findings.filter(f=>!old.has(fingerprint(f))), resolved:(baseline.findings||[]).filter(f=>!current.has(fingerprint(f)))}};
}
export function toMarkdown(report) {
  const s=report.summary;
  const heading=`# SkillPath Guard report\n\nScanned ${s.skills} skill(s); ${s.error} errors, ${s.warning} warnings.\n\n`;
  const rows=report.findings.length ? report.findings.map(f=>`| ${f.severity} | ${f.rule} | \`${f.file}:${f.line}\` | ${f.message.replaceAll('|','\\|')} |`).join('\n') : '| OK | - | - | No findings |';
  const compare=report.comparison ? `\n\nBaseline comparison: ${report.comparison.new.length} new, ${report.comparison.resolved.length} resolved.\n` : '';
  return `${heading}| Severity | Rule | Location | Explanation |\n|---|---|---|---|\n${rows}${compare}\n\nNote: static checks do not replace actual tests in each agent runtime.\n`;
}
export function githubAnnotations(report) {
  return report.findings.map(f=>{
    const level=f.severity==='error'?'error':'warning';
    const annotationFile=report.root?rel(process.cwd(),path.resolve(report.root,f.file)):f.file;
    const escape=s=>String(s).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A').replaceAll(':','%3A').replaceAll(',','%2C');
    return `::${level} file=${escape(annotationFile)},line=${f.line},title=${escape(f.rule)}::${escape(f.message)}`;
  });
}
