// Generates labelled fixtures: node make-fixtures.mjs <outDir>
// Each case has a ground-truth label: "defect" (a validator SHOULD report it) or "clean" (it should NOT).
import fs from 'node:fs'; import path from 'node:path';
const out = process.argv[2]; if (!out) { console.error('usage: node make-fixtures.mjs <outDir>'); process.exit(2); }
const D = 'Does a thing. Use when the user asks for the thing.';
const fm = (name, extra = '') => `---\nname: ${name}\ndescription: ${D}\n${extra}---\n`;
// id, class, label, files (path -> content). The skill folder is always <out>/<id>/<id>/.
const cases = [
  ['c01-clean', 'control', 'clean', { 'SKILL.md': fm('c01-clean') + '\n# Skill\n\nDo the thing.\n' }],
  ['c02-valid-link', 'control', 'clean', { 'SKILL.md': fm('c02-valid-link') + '\nSee [guide](references/guide.md).\n', 'references/guide.md': '# g\n' }],
  ['c03-link-in-code', 'control', 'clean', { 'SKILL.md': fm('c03-link-in-code') + '\n```js\nconst x = arr[i](missing);\n```\n' }],
  ['c04-external-url', 'control', 'clean', { 'SKILL.md': fm('c04-external-url') + '\nSee [docs](https://example.com/a/b.md).\n' }],
  ['d01-name-dir-mismatch', 'metadata', 'defect', { 'SKILL.md': fm('other-name') + '\nBody.\n' }],
  ['d02-name-uppercase', 'metadata', 'defect', { 'SKILL.md': fm('D02-Name-Uppercase') + '\nBody.\n' }],
  ['d03-name-missing', 'metadata', 'defect', { 'SKILL.md': `---\ndescription: ${D}\n---\nBody.\n` }],
  ['d04-description-missing', 'metadata', 'defect', { 'SKILL.md': '---\nname: d04-description-missing\n---\nBody.\n' }],
  ['d05-description-too-long', 'metadata', 'defect', { 'SKILL.md': `---\nname: d05-description-too-long\ndescription: ${'x'.repeat(1100)}\n---\nBody.\n` }],
  ['d06-compat-too-long', 'metadata', 'defect', { 'SKILL.md': fm('d06-compat-too-long', `compatibility: ${'y'.repeat(600)}\n`) + 'Body.\n' }],
  ['d07-invalid-yaml-unclosed-quote', 'metadata', 'defect', { 'SKILL.md': `---\nname: d07-invalid-yaml-unclosed-quote\ndescription: "unterminated\n---\nBody.\n` }],
  ['d08-no-frontmatter', 'metadata', 'defect', { 'SKILL.md': '# Just a heading\n\nNo frontmatter.\n' }],
  ['d09-name-double-hyphen', 'metadata', 'defect', { 'SKILL.md': fm('d09--double') + 'Body.\n' }],
  ['s01-unknown-field', 'spec-strict', 'strict', { 'SKILL.md': fm('s01-unknown-field', 'argument-hint: [file]\n') + 'Body.\n' }],
  ['r01-missing-link', 'reference', 'defect', { 'SKILL.md': fm('r01-missing-link') + '\nSee [guide](references/nope.md).\n' }],
  ['r02-case-mismatch', 'reference', 'defect', { 'SKILL.md': fm('r02-case-mismatch') + '\nSee [guide](references/guide.md).\n', 'references/Guide.md': '# g\n' }],
  ['r03-escapes-skill-dir', 'reference', 'defect', { 'SKILL.md': fm('r03-escapes-skill-dir') + '\nSee [shared](../shared/style.md).\n' }],
  ['r04-absolute-path', 'reference', 'defect', { 'SKILL.md': fm('r04-absolute-path') + '\nSee [cfg](/home/alice/cfg.md) and `C:\\Users\\alice\\cfg.md`.\n' }],
  ['r05-missing-bare-script', 'reference', 'defect', { 'SKILL.md': fm('r05-missing-bare-script') + '\nRun `python scripts/run.py` first.\n' }],
];
for (const [id, cls, label, files] of cases) {
  const dir = path.join(out, id, id);
  for (const [f, c] of Object.entries(files)) { const p = path.join(dir, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); }
  fs.writeFileSync(path.join(out, id, 'LABEL'), `${label}\t${cls}\n`);
}
console.log(`${cases.length} fixtures in ${out}`);
