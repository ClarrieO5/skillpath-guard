// Run against a separately downloaded public repository. No network or execution of skills.
import fs from 'node:fs';
import path from 'node:path';
import {scan} from '../src/core.mjs';
const base=process.argv[2];
if(!base){console.error('Usage: node scripts/audit-corpus.mjs /path/to/anthropics-skills/skills');process.exit(2);}
const names=['webapp-testing','mcp-builder','slack-gif-creator','internal-comms','theme-factory','frontend-design','doc-coauthoring','algorithmic-art','canvas-design','web-artifacts-builder'];
const results=names.map(name=>{const report=scan(path.join(base,name));delete report.root;return {skill:name,report};});
process.stdout.write(JSON.stringify(results,null,2)+'\n');
