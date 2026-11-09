/** A bounded Markdown subset, not a CommonMark parser. No code is evaluated. */
export function findReferenceTokens(line) {
  const results=[];
  const occupied=[];
  // Inline links with angle destinations or balanced parentheses and optional titles.
  const start=/!?\[[^\]\n]*\]\(/g;
  let m;
  while((m=start.exec(line))) {
    let i=start.lastIndex, depth=0, value='';
    while(/\s/.test(line[i]||'') && i<line.length) i++;
    if(line[i]==='<') {const end=line.indexOf('>',i+1);if(end<0)continue;value=line.slice(i+1,end);i=end+1;}
    else {
      for(;i<line.length;i++) {
        const c=line[i];
        // CommonMark: a backslash escapes only ASCII punctuation; otherwise it is literal (Windows paths).
        if(c==='\\' && i+1<line.length && /[!-\/:-@\[-`{-~]/.test(line[i+1])){value+=line[++i];continue;}
        if(c==='(')depth++;
        if(c===')'){if(depth===0)break;depth--;}
        if(/\s/.test(c) && depth===0)break;
        value+=c;
      }
    }
    const end=line.indexOf(')',i);
    occupied.push([m.index,end<0?line.length:end+1]);
    results.push({value,source:'markdown'});
    start.lastIndex=end<0?line.length:end+1;
  }
  // Reference definitions are checked at their definition line, including unused ones.
  const definition=line.match(/^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/);
  if(definition){results.push({value:definition[1]||definition[2],source:'markdown'});occupied.push([0,line.length]);}
  // Exclude complete URLs, dynamic tokens and substrings of longer paths.
  const tokens=/(?:https?:\/\/[^\s`<>]+)|(?:[^\s`<>"'()]*\b(?:references|scripts|assets)\/[^\s`<>"'()]*)/g;
  while((m=tokens.exec(line))) {
    if(occupied.some(([a,b])=>m.index>=a&&m.index<b))continue;
    if(!/^(?:\.\/)?(?:references|scripts|assets)\//.test(m[0]))continue;
    results.push({value:m[0],source:'prose'});
  }
  return results;
}
export function sanitizeReference(raw,source='markdown') {
  let value=raw.trim();
  if(source==='prose')value=value.replace(/[,.;:]+$/,'');
  if(!value||value.startsWith('#')||value.startsWith('//'))return null;
  // Windows drive paths are local, all other URI schemes are external.
  if(/^[a-z][a-z0-9+.-]*:/i.test(value)&&! /^[a-z]:[\\/]/i.test(value))return null;
  if(/\$|\*|<[^>]+>|\{\{|\[|\]/.test(value))return null;
  value=value.split('#')[0].split('?')[0];
  try{value=decodeURIComponent(value);}catch{return null;}
  if(!value||value.includes('\0'))return null;
  return value.replace(/^\.\//,'');
}
