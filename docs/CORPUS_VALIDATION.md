# Public-corpus validation (unreleased 0.2.0 work)

Method: shallow clones (2026-11-09) of 23 public repositories that contain or collect Agent Skills, scanned with `node src/cli.mjs scan <repo> --format json`. 21 contained SKILL.md files (about 2,880 skills in total, including mirrored copies); `Graphify-Labs/graphify` and `msitarzewski/agency-agents` contained none. Repos: anthropics/skills, obra/superpowers, addyosmani/agent-skills, cloudflare/security-audit-skill, mvanhorn/last30days-skill, blader/humanizer, cathrynlavery/diagram-design, coreyhaines31/marketingskills, K-Dense-AI/scientific-agent-skills, Imbad0202/academic-research-skills, Yuan1z0825/nature-skills, kepano/obsidian-skills, sickn33/agentic-awesome-skills, hugohe3/ppt-master, ComposioHQ/awesome-claude-skills, shanraisshan/claude-code-best-practice, affaan-m/ECC, ayghri/i-have-adhd, nexu-io/open-design, career-ops-hq/career-ops, plus the two empty ones. Findings were triaged by sampling, not exhaustively hand-verified; counts are not an accuracy rate.

Findings with v0.1.x + PR #2 (all repos): AMBIGUOUS_CWD 875, MISSING_REFERENCE 593, PATH_ESCAPE 313, NAME_INVALID 146, DESCRIPTION_INVALID 15, FRONTMATTER_MISSING/NAME_MISSING 14 each, SYMLINK_ESCAPE 6, ABSOLUTE_REFERENCE 1.

## Observed issues, ranked by corpus impact

1. **Bare folder mentions reported as missing (about 145).** `scripts/` or `references/` in prose/tree diagrams is a layout mention. *Fixed.*
2. **Link syntax inside code (about 3 confirmed).** Go generics `func f[T any](t T)` produced a bogus target `t`; `[text](url)` in code spans are placeholders. *Fixed* (links ignored in code spans and non-Markdown fences; resource paths in code still checked).
3. **`../sibling` references (313 PATH_ESCAPE), mostly true positives.** Skills that share files break when installed individually. Not changed; a distinct rule/severity for "inside scan root" is a candidate (changes exit codes, needs a decision).
4. **Mirrored skill trees** (ECC `.kiro/`, `docs/<lang>/`; open-design) multiply findings. Candidate: `--ignore` option.
5. **Root-relative web routes** such as `[x](/features/analytics)` give ABSOLUTE_REFERENCE (1 seen, likely false positive). Candidate.

Also observed: a SKILL.md symlink to a shared file (career-ops) is reported as SYMLINK_ESCAPE and not read (true portability risk, but its content is unchecked); `anthropics/skills` `claude-api` description exceeds 1024 characters (true spec violation); the largest repos (500-1,000+ skills) scan slowly because per-skill file filtering is O(skills x files) — candidate fix, not done.

After the fixes: MISSING_REFERENCE 593 to 445, AMBIGUOUS_CWD 875 to 870, PATH_ESCAPE 313 to 317 (+4 not investigated), all other rules unchanged.

## Not done
No comparison against other validators was performed, no agent-runtime tests, and no human review of every finding. Results are not evidence of runtime compatibility.
