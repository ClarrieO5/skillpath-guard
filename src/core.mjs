/** SkillPath Guard: deterministic, offline diagnostics for Agent Skills packages.
 * This is NOT a complete YAML parser, behavioural evaluator or runtime emulator.
 */
import fs from 'node:fs';
import path from 'node:path';
import {findReferenceTokens, sanitizeReference} from './references.mjs';

const IGNORED = new Set(['.git', 'node_modules', '.next', 'dist', 'build', '.DS_Store']);
// Matches the reference validator (skills-ref): Unicode letters/digits and single hyphens, lowercase, NFKC-normalized.
const SKILL_NAME = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;
const nfkc = s => s.normalize('NFKC');

function normalizeSlash(s) { return s.replaceAll('\\', '/'); }
function rel(base, file) { return normalizeSlash(path.relative(base, file)) || '.'; }
function pushFinding(out, {rule, severity, file, line=1, message, target='', skill=''}) {
  out.push({rule, severity, file, line, message, target, skill});
}

function listFiles(directory, exclusions) {
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
      const relative = rel(directory,candidate);
      if(exclusions.some(p=>relative===p || relative.startsWith(p+'/')))continue;
      if (entry.isDirectory()) todo.push(candidate);
      else if (entry.isFile() || entry.isSymbolicLink()) out.push(candidate);
    }
  }
  return out.sort();
}

// Index of the closing quote in `text` (a scalar that starts with `quote`), or -1.
function closesQuote(text,quote,continuation=false) {
  let k=continuation?0:1;
  for(; k<text.length; k++) {
    if(quote==='"' && text[k]==='\\') { k++; continue; }
    if(text[k]===quote) { if(quote==="'" && text[k+1]==="'") { k++; continue; } return k; }
  }
  return -1;
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
    const startLine=i;
    let value = match[2].trim();
    if(Object.hasOwn(fields,match[1]))problems.push({rule:'FRONTMATTER_DUPLICATE',line:i+1,message:`Duplicate frontmatter field: ${match[1]}`});
    if(!value.startsWith('\"') && !value.startsWith("'"))value=value.replace(/\s+#.*$/,'');
    // A plain (unquoted, single-line) scalar cannot contain ": " or end with ":"; YAML reads it as a nested mapping and strict parsers reject the frontmatter.
    if(value && !/^(?:["'>|&*{\[!#]|-\s)/.test(value) && /:(?:\s|$)/.test(value))problems.push({rule:'FRONTMATTER_UNSUPPORTED',line:i+1,message:`Invalid YAML for ${match[1]}: an unquoted value cannot contain ": " (a colon followed by a space) or end with ":", so YAML parsers reject the whole frontmatter. Quote the value or use a block scalar (>-).`});
    if(['name','description'].includes(match[1]) && /^(?:[&*{\[]|!!)/.test(value))problems.push({rule:'FRONTMATTER_UNSUPPORTED',line:i+1,message:`Unsupported YAML for ${match[1]}; use a plain, quoted, or block string.`});
    // Indented plain strings are a common YAML spelling in public skills.
    if(value==='' && ['name','description'].includes(match[1])) {
      const block=[];
      while(i+1<end && (/^\s+/.test(lines[i+1]) || !lines[i+1].trim())) {
        const next=lines[++i].trim();
        if(next && !next.startsWith('#'))block.push(next.replace(/\s+#.*$/,''));
      }
      if(block.some(line=>/^(?:-\s|[^:]+:\s|[\[\{&*]|!!)/.test(line))) {
        problems.push({rule:'FRONTMATTER_UNSUPPORTED',line:i+1,message:`Unsupported YAML for ${match[1]}; expected an indented plain string.`});
      } else value=block.join(' ');
    }
    if (/^[>|][+-]?$/.test(value)) {
      const block = [];
      while (i+1<end && (/^\s+/.test(lines[i+1]) || !lines[i+1].trim())) {
        const next = lines[++i]; if (next.trim()) block.push(next.trim());
      }
      value = block.join(value.startsWith('>')?' ':'\n');
    }
    const quote=value[0];
    if((quote==='"'||quote==="'") && closesQuote(value,quote)<0) {
      // A quoted scalar may continue on following lines (YAML folds them); if no line closes it, the frontmatter is not valid YAML.
      const parts=[value]; let closed=false;
      // YAML continuation lines must be indented: an unindented `key:` line ends the search.
      for(let j=i+1; j<end && !closed; j++) { if(/^[^\s#]/.test(lines[j])) break; parts.push(lines[j].trim()); i=j; closed=closesQuote(lines[j].trim(),quote,true)>=0; }
      if(closed) value=parts.join(' ');
      else { i=startLine; problems.push({rule:'FRONTMATTER_UNSUPPORTED',line:i+1,message:`Unterminated quoted string for ${match[1]}: the closing ${quote} is missing, so this is not valid YAML and a strict parser will reject the whole frontmatter.`}); }
    }
    if(quote==='"'||quote==="'") { const c=closesQuote(value,quote); if(c>0) value=value.slice(0,c+1); }
    if ((value.startsWith('"') && value.endsWith('"') && value.length>1) || (value.startsWith("'") && value.endsWith("'") && value.length>1)) value = value.slice(1,-1);
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
// `./assets/card-builder` (TS import) or `references/open-coding` (table entry) names exactly one file with that stem.
function resolvesByExtension(candidate) {
  if (path.extname(candidate)) return false;
  try { return fs.readdirSync(path.dirname(candidate)).filter(n => n.startsWith(path.basename(candidate)+'.')).length === 1; } catch { return false; }
}
// "Route to `other-skill`; its `references/x.md`": the file belongs to another skill named on this or the previous line.
function belongsToNamedSkill(reference, context, skillDirsByName, ownName) {
  for (const [name, dirs] of skillDirsByName) {
    if (name === ownName || !context.includes(name)) continue;
    if (!new RegExp(`(?<![\\w-])${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?![\\w-])`).test(context)) continue;
    if (dirs.some(d => fs.existsSync(path.resolve(d, reference)))) return true;
  }
  return false;
}
// `[analytics](/features/analytics)` in a skill about websites is a site route, not a file on this machine.
// Anything that looks like a filesystem path stays ABSOLUTE_REFERENCE: a known OS root, a resource folder, or a file extension.
const OS_ROOTS = new Set(['Users','home','root','tmp','var','etc','opt','usr','bin','sbin','lib','mnt','media','srv','private','Volumes','Applications','Library','System','dev','proc','nix','workspace','workspaces','c','d']);
function isWebRoute(reference) {
  if (!/^\/(?!\/)/.test(reference)) return false;
  const parts = reference.split('/').filter(Boolean);
  if (!parts.length) return true;
  return !OS_ROOTS.has(parts[0]) && !parts.some(p => /^(?:references|scripts|assets)$/.test(p)) && !path.posix.extname(parts.at(-1));
}
function isSharedInsideRoot(root, candidate) {
  try { return fs.existsSync(candidate) && insideDirectory(fs.realpathSync(root), fs.realpathSync(candidate)); } catch { return false; }
}
function insideDirectory(parent, candidate) {
  const p = path.relative(parent, candidate);
  return p === '' || (p !== '..' && !p.startsWith(`..${path.sep}`) && !path.isAbsolute(p));
}
function lineHasCwdSensitiveInstruction(line, reference, nextLine="") {
  const verbs = /\b(read|open|view|cat|run|execute|load|inspect|source|import)\b/i;
  return !/^\s*by (?:its|the|an) absolute path\b/i.test(nextLine) && verbs.test(line) && line.includes(reference) && !/\b(absolute path|skill directory|skill root|base directory|resolve against)\b/i.test(line);
}

function normalizeExclusions(exclude) {
  if(!Array.isArray(exclude))throw new Error('Exclusions must be an array of root-relative paths.');
  return [...new Set(exclude.map(value=>{
    if(typeof value!=='string')throw new Error('Invalid exclusion path.');
    const p=normalizeSlash(value);
    if(!p || /^(?:[a-z]:|\/|~)/i.test(p) || p.split('/').includes('..'))throw new Error('Exclusion must stay inside the scan root.');
    const normalized=path.posix.normalize(p).replace(/\/$/,'');
    if(normalized==='.')throw new Error('Cannot exclude the entire scan root.');
    return normalized;
  }))].sort();
}

// `<!-- skillpath-guard-ignore -->` on a line, or `<!-- skillpath-guard-ignore-next-line -->` alone on the line before,
// silences line-level findings there: a maintainer's decision about an illustrative or intentionally absent path.
const IGNORE_LINE = /<!--\s*skillpath-guard-ignore\s*-->/;
const IGNORE_NEXT = /^\s*<!--\s*skillpath-guard-ignore-next-line\s*-->\s*$/;

export function scan(rootInput, {exclude=[], cwdHints=false, allowShared=false}={}) {
  const root = path.resolve(rootInput);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Directory not found: ${root}`);
  const exclusions=normalizeExclusions(exclude);
  const files = listFiles(root,exclusions);
  const skillFiles = files.filter(p => path.basename(p) === 'SKILL.md');
  // Index resources under every containing skill once, including nested skills.
  const resourceIndex=new Map(skillFiles.map(p=>[path.dirname(p),[]]));
  for(const file of files) {
    for(let dir=path.dirname(file);insideDirectory(root,dir);dir=path.dirname(dir)) {
      if(resourceIndex.has(dir))resourceIndex.get(dir).push(file);
      if(dir===root)break;
    }
  }
  const findings = [];
  const skills = [];
  const ignoredLines = new Set();
  const skillDirsByName = new Map();
  for (const f of skillFiles) { const d=path.dirname(f), n=path.basename(d); if(!skillDirsByName.has(n))skillDirsByName.set(n,[]); skillDirsByName.get(n).push(d); }
  // A skill folder that is a dangling symlink (plugins/x/skills/y -> missing) has no SKILL.md to find; report the link itself.
  for (const file of files) {
    if (path.basename(path.dirname(file)) !== 'skills' || path.basename(file) === 'SKILL.md') continue;
    let target;
    try { if (!fs.lstatSync(file).isSymbolicLink() || fs.existsSync(file)) continue; target = fs.readlinkSync(file); } catch { continue; }
    pushFinding(findings,{rule:'SYMLINK_BROKEN',severity:'error',file:rel(root,file),skill:path.basename(file),target:normalizeSlash(target),message:`Skill folder is a dangling symlink to ${normalizeSlash(target)}, which does not exist; this skill cannot load.`});
  }
  if (!skillFiles.length) pushFinding(findings, {rule:'NO_SKILLS', severity:'error', file:'.', message:'No SKILL.md found in target directory.'});
  // Index files by owning skill directory once (O(files x depth)) instead of filtering all files per skill.
  const skillDirs = new Set(skillFiles.map(f => path.dirname(f)));
  const filesBySkill = new Map([...skillDirs].map(d => [d, []]));
  for (const file of files) {
    for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
      if (skillDirs.has(dir)) filesBySkill.get(dir).push(file);
      if (dir === root || dir === path.dirname(dir)) break;
    }
  }
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
    else {
      const n=nfkc(fields.name), reasons=[];
      if (n.length>64) reasons.push(`is ${n.length} characters (maximum 64)`);
      if (n!==n.toLowerCase()) reasons.push('contains uppercase letters');
      if (!SKILL_NAME.test(n)) reasons.push('must be only letters, digits and single hyphens, with no leading or trailing hyphen');
      const mismatch=n!==nfkc(skillName);
      if (mismatch) reasons.push(`does not match the folder name '${skillName}' (the specification requires them to be equal)`);
      if (reasons.length) pushFinding(findings,{rule:'NAME_INVALID',severity:'error',file:relativeFile,skill:skillName,message:`name '${fields.name}' ${reasons.join('; ')}.`+(skillDir===root && mismatch && SKILL_NAME.test(n) ? ` This skill is at the scan root, so the folder name comes from where it was checked out; if the repository is named '${fields.name}', clone it into a folder of that name before scanning.` : '')});
    }
    if (!fields.description?.trim() || fields.description.length>1024) pushFinding(findings,{rule:'DESCRIPTION_INVALID',severity:'error',file:relativeFile,skill:skillName,message:fields.description?.trim() ? `description is ${fields.description.length} characters; the maximum is 1024.` : 'description is missing or empty; it must be non-empty and at most 1024 characters.'});
    if (fields.compatibility !== undefined && fields.compatibility.length>500) pushFinding(findings,{rule:'COMPATIBILITY_INVALID',severity:'error',file:relativeFile,skill:skillName,message:`compatibility is ${fields.compatibility.length} characters; the maximum is 500 (Agent Skills specification).`});
    const bodyStart = end<0 ? 0 : end+1;
    if (lines.slice(bodyStart).join('').trim().length===0) pushFinding(findings,{rule:'BODY_EMPTY',severity:'warning',file:relativeFile,skill:skillName,message:'The skill has no instructions after frontmatter.'});
    for (let i=bodyStart; i<lines.length; i++) {
      if (IGNORE_NEXT.test(lines[i])) ignoredLines.add(`${relativeFile}:${i+2}`);
      else if (IGNORE_LINE.test(lines[i])) ignoredLines.add(`${relativeFile}:${i+1}`);
    }
    let fence=null; // {marker, illustrative}
    for (let lineNo=bodyStart; lineNo<lines.length; lineNo++) {
      const line = lines[lineNo];
      const fenceMatch=line.match(/^\s{0,3}(`{3,}|~{3,})\s*([\w-]*)/);
      if (fence) { if (fenceMatch && fenceMatch[1][0]===fence.marker[0] && fenceMatch[1].length>=fence.marker.length && !line.replace(/^\s{0,3}[`~]+/,'').trim()) fence=null; else if (fence.illustrative) continue; }
      else if (fenceMatch) { fence={marker:fenceMatch[1],illustrative:['markdown','md'].includes(fenceMatch[2].toLowerCase())}; if (fence.illustrative) continue; }
      const tokens = findReferenceTokens(line,{links:!fence});
      for (const token of tokens) {
        const reference = sanitizeReference(token.value,token.source);
        if (!reference || (token.source==='markdown' && isWebRoute(reference))) continue;
        const tokenKey=`${lineNo}:${reference}`;
        if (seenRefs.has(tokenKey)) continue;
        seenRefs.add(tokenKey);
        const candidate = path.resolve(skillDir, reference);
        const edge = {from:relativeFile, target:reference, line:lineNo+1, status:'ok'};
        if (/^(?:[a-z]:[\\/]|[\\/]|~)/i.test(reference)) {
          edge.status='absolute';
          pushFinding(findings,{rule:'ABSOLUTE_REFERENCE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Machine-specific absolute reference: ${reference}`});
        } else if (!insideDirectory(skillDir,candidate) && allowShared && isSharedInsideRoot(root,candidate)) {
          // Opt-in: a repository installed as one bundle (plugin, monorepo) may share files between skills.
          edge.status='shared';
          pushFinding(findings,{rule:'SHARED_REFERENCE',severity:'warning',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Reference leaves the skill folder but exists in this repository (${rel(root,candidate)}). It works only when the whole repository or bundle is installed; installing this skill on its own breaks it.`});
        } else if (!insideDirectory(skillDir,candidate)) {
          edge.status='escape';
          pushFinding(findings,{rule:'PATH_ESCAPE',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Reference escapes skill directory: ${reference}`+(isSharedInsideRoot(root,candidate)?` (the file exists at ${rel(root,candidate)}; if this repository is always installed as a whole, --allow-shared reports this as a warning).`:'')});
        } else {
          let alternate=null;
          try { alternate=findSameNameDifferentCase(skillDir,reference); } catch {}
          if (alternate && rel(skillDir,alternate)!==path.posix.normalize(reference).replace(/\/$/,'')) {
            edge.status='case-mismatch';
            pushFinding(findings,{rule:'CASE_MISMATCH',severity:'error',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Case mismatch for ${reference}; found ${rel(skillDir,alternate)}`});
          } else if (!fs.existsSync(candidate) && !alternate && resolvesByExtension(candidate)) {
            edge.status='ok';
          } else if (!fs.existsSync(candidate) && !alternate && belongsToNamedSkill(reference, `${lines[lineNo-1]||''}\n${line}`, skillDirsByName, skillName)) {
            edge.status='other-skill';
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
        if (cwdHints && !['absolute','escape','shared','symlink-escape'].includes(edge.status) && lineHasCwdSensitiveInstruction(line, token.value, lines[lineNo+1]||'')) pushFinding(findings,{rule:'AMBIGUOUS_CWD',severity:'warning',file:relativeFile,line:lineNo+1,skill:skillName,target:reference,message:`Instruction uses a relative resource path (${reference}); some agents resolve paths from the workspace instead of the skill directory. Verify with the target runtime.`});
      }
    }
    const skillFilesOnly=resourceIndex.get(skillDir).filter(p=>p!==filename);
    const lowerMap = new Map();
    for (const file of skillFilesOnly) {
      const rp=rel(skillDir,file);
      const key=rp.toLowerCase();
      const other=lowerMap.get(key);
      if (other && other!==rp) pushFinding(findings,{rule:'CASE_COLLISION',severity:'warning',file:relativeFile,skill:skillName,target:rp,message:`Two resources differ only by letter case: ${other} and ${rp}`});
      else lowerMap.set(key,rp);
    }
  }
  const kept = findings.filter(f => !ignoredLines.has(`${f.file}:${f.line}`));
  const suppressed = findings.length - kept.length;
  findings.length = 0; findings.push(...kept);
  findings.sort((a,b)=>a.file.localeCompare(b.file)||a.line-b.line||a.rule.localeCompare(b.rule));
  const counts={error:findings.filter(f=>f.severity==='error').length, warning:findings.filter(f=>f.severity==='warning').length};
  return {tool:'skillpath-guard', version:'0.3.3', root, exclusions, options:{cwdHints, allowShared}, summary:{skills:skills.length, findings:findings.length, ...counts, suppressed}, skills, findings, limitations:['Heuristic resource detection may produce false positives or miss references in unusual Markdown.','Static analysis cannot prove how an individual AI agent will resolve a file at runtime.','Frontmatter reading covers common scalar fields; this is not a complete YAML implementation.']};
}

// Message wording of these metadata rules improved in 0.3.3; their identity ignores the message so v0.3.2 baselines stay valid.
const MESSAGE_FREE_IDENTITY = new Set(['NAME_INVALID','DESCRIPTION_INVALID','COMPATIBILITY_INVALID']);
export function fingerprint(f) { return JSON.stringify([f.rule,f.severity,f.file,f.target||'',MESSAGE_FREE_IDENTITY.has(f.rule)?'':f.message]); }
export function compareBaseline(report,baseline) {
  if (!baseline || baseline.tool!=='skillpath-guard' || !Array.isArray(baseline.findings) || baseline.findings.some(f=>!f || !['error','warning'].includes(f.severity) || !['rule','file','message'].every(k=>typeof f[k]==='string') || (f.target!==undefined && typeof f.target!=='string'))) throw new Error('Invalid baseline: expected a SkillPath Guard JSON report with valid findings.');
  if(JSON.stringify(normalizeExclusions(report.exclusions??[]))!==JSON.stringify(normalizeExclusions(baseline.exclusions??[])))throw new Error('Baseline exclusions differ from this scan; compare identical discovery scopes.');
  const current=new Set(report.findings.map(fingerprint));
  const old=new Set((baseline.findings||[]).map(fingerprint));
  return {...report, comparison:{new:report.findings.filter(f=>!old.has(fingerprint(f))), resolved:(baseline.findings||[]).filter(f=>!current.has(fingerprint(f)))}};
}
export function toMarkdown(report) {
  const s=report.summary;
  const heading=`# SkillPath Guard report\n\nScanned ${s.skills} skill(s); ${s.error} errors, ${s.warning} warnings.\n\n`;
  const MAX_ROWS=500; // GitHub job summaries are limited to 1 MiB.
  const shown=report.findings.slice(0,MAX_ROWS);
  const rows=report.findings.length ? shown.map(f=>`| ${f.severity} | ${f.rule} | \`${f.file}:${f.line}\` | ${f.message.replaceAll('|','\\|')} |`).join('\n') : '| OK | - | - | No findings |';
  const more=report.findings.length>MAX_ROWS ? `\n\n${report.findings.length-MAX_ROWS} more finding(s) not shown; use --format json for the full list.` : '';
  const suppressedNote=s.suppressed ? `\n\n${s.suppressed} finding(s) silenced by skillpath-guard-ignore comments.` : '';
  const compare=report.comparison ? `\n\nBaseline comparison: ${report.comparison.new.length} new, ${report.comparison.resolved.length} resolved.\n` : '';
  return `${heading}| Severity | Rule | Location | Explanation |\n|---|---|---|---|\n${rows}${more}${suppressedNote}${compare}\n\nNote: static checks do not replace actual tests in each agent runtime.\n`;
}
export function githubAnnotations(report) {
  return report.findings.map(f=>{
    const level=f.severity==='error'?'error':'warning';
    const annotationFile=report.root?rel(process.cwd(),path.resolve(report.root,f.file)):f.file;
    // Workflow-command escaping: message data escapes only % \r \n; properties also escape : and ,
    const escapeData=s=>String(s).replaceAll('%','%25').replaceAll('\r','%0D').replaceAll('\n','%0A');
    const escapeProperty=s=>escapeData(s).replaceAll(':','%3A').replaceAll(',','%2C');
    return `::${level} file=${escapeProperty(annotationFile)},line=${f.line},title=${escapeProperty(f.rule)}::${escapeData(f.message)}`;
  });
}
