# Public-corpus validation (unreleased 0.2.0 work)

## Corrections (second pass)

The first version of this document (PR #3) contained errors, now fixed:

- It reported "about 2,880 skills". That excluded `sickn33/agentic-awesome-skills` (**9,013 skills**): its first scan finished after I had aggregated results and its re-scan hit my own 100 s timeout. Total scanned is **11,864 skills in 23 repositories (21 with skills)**, including mirrored copies.
- The "PATH_ESCAPE 313 to 317 (+4)" change was **not a code effect**. `tt-a1i/archify` (5 skills, 4 PATH_ESCAPE) was missing from the first baseline because its clone raced the scan. Like-for-like (same 21 repos, excluding sickn33), PATH_ESCAPE is unchanged at 313.
- Like-for-like effect of the PR #3 fixes: MISSING_REFERENCE 593 to 444 (-149), AMBIGUOUS_CWD 875 to 843 (-32), all other rules unchanged. These are counts of removed findings, not a measured accuracy rate.
- `sickn33` (new code): 2,503 AMBIGUOUS_CWD, 1,396 MISSING_REFERENCE, 3 NAME_INVALID, 1 PATH_ESCAPE; only a sample was inspected.

## Performance (fixed in this PR)

The per-skill case-collision check filtered every file for every skill (O(skills x files)). `nexu-io/open-design` (562 skills) took 8.9 s and now takes 0.56 s; `sickn33` (9,013 skills) now scans in about 22 s (the old code ran for minutes and was killed). Output for open-design/sickn33 differs from before only through the PR #3 fixes.


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
No human review of every finding. Results are not evidence of runtime compatibility. See `COMPARISON.md` and `RUNTIME_EVIDENCE.md`.
