# Public-corpus validation (0.2.0 work, released as `V0.2.0`; round 2 with 38 more repositories: `docs/CONTRIBUTION_RESEARCH_2026-11.md`)

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
5. **Root-relative web routes** such as `[x](/features/analytics)` give ABSOLUTE_REFERENCE (1 seen, likely false positive). *Fixed in round 3* (below).

Also observed: a SKILL.md symlink to a shared file (career-ops) is reported as SYMLINK_ESCAPE and not read (true portability risk, but its content is unchecked); `anthropics/skills` `claude-api` description exceeds 1024 characters (true spec violation); the largest repos (500-1,000+ skills) scan slowly because per-skill file filtering is O(skills x files) — candidate fix, not done.

After the fixes: MISSING_REFERENCE 593 to 445, AMBIGUOUS_CWD 875 to 870, PATH_ESCAPE 313 to 317 (+4 not investigated), all other rules unchanged.

## Not done
No human review of every finding. Results are not evidence of runtime compatibility. See `COMPARISON.md` and `RUNTIME_EVIDENCE.md`.

## Precision spot check (second pass)
A seeded random sample of 24 MISSING_REFERENCE findings (excluding the 9,013-skill repo) was read against its source line: 23 looked like genuine missing files for a standalone skill (many are `assets/...` or `scripts/...` files that live outside the skill folder), 1 was a false positive (`scripts/,` in a prose list), now fixed with a regression test. This is a small, single-reviewer sample and not an accuracy rate; AMBIGUOUS_CWD was not sampled and is unvalidated.

## Round 3 (2026-11-10): re-scan with v0.2.1 + fixes

Method: fresh shallow clones of 20 repositories already in rounds 1-2 (3,165 skills including mirrored copies), scanned with `main` (v0.2.1), then again with this round's fixes. Commits: anthropics/skills 2c5958e, github/awesome-copilot e45ee93, expo/skills a9e5bd3, openai/skills 49f948f, wshobson/agents 9c61ab2, K-Dense-AI/scientific-agent-skills 2d2065f, microsoft/skills 18e05b8, cloudflare/skills 6eb6c78, huggingface/skills 25910b3, getsentry/skills e94f222, trailofbits/skills e4dd0bb, obra/superpowers 22f0b46, coreyhaines31/marketingskills 7c18794, affaan-m/ECC d2ef268, jezweb/claude-skills 1260fa7, alirezarezvani/claude-skills 8f08254, supabase/agent-skills c9be0e9, remotion-dev/skills 1af7e69, dotnet/skills 96c3d68, anthropics/claude-plugins-official ea686ba.

Every `ABSOLUTE_REFERENCE`, `CASE_MISMATCH`, `NAME_INVALID` and `DESCRIPTION_INVALID` finding was read at its source line, as was every `MISSING_REFERENCE` outside ECC and claude-plugins-official (those two were summarized by target, and the unusual ones were read). `AMBIGUOUS_CWD` and `PATH_ESCAPE` were not triaged.

New scanner defects found and fixed, each with a regression test that failed before the fix:

| Defect | Example | Effect of fix on the corpus |
|---|---|---|
| GFM footnote `[^1]: text` parsed as a link reference definition | K-Dense `markdown-mermaid-writing` lines 341, 343: targets `GitHub`, `Mermaid.` | 2 false positives removed. The fixture also shows a **false negative** fixed: a real path inside a footnote used to be skipped. |
| `:line` / `:/container` suffix kept in a bare path | alirezarezvani `skill-security-auditor`: `scripts/helper.py:42`; ECC `docker-patterns` (6 mirrors): `./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql` | 15 targets corrected (`scripts/helper.py`, `scripts/init.sql`...). They stay reported because those files really are absent from the skill. No corpus case had an *existing* file hidden by the suffix; the fixture covers that case. |
| Root-relative web route reported as a machine path | marketingskills `site-architecture:267`: `[analytics](/features/analytics)` in an internal-linking example | 1 false positive removed. `~/.claude/skills/...` (jezweb, 2) is still reported, correctly. |

Before -> after, all 20 repositories: `MISSING_REFERENCE` 213 -> 211, `ABSOLUTE_REFERENCE` 3 -> 2; all other rules unchanged (`AMBIGUOUS_CWD` 1,518, `PATH_ESCAPE` 496, `SYMLINK_ESCAPE` 67, `NAME_INVALID` 18, `SYMLINK_BROKEN` 10, `CASE_MISMATCH` 3, `DESCRIPTION_INVALID` 1). The full before/after difference is 18 removed and 15 added findings, all listed above and all reviewed.

Remaining known false-positive classes, not changed (each needs semantic judgement, not syntax): illustrative examples in skill-writing guides (openai/microsoft `skill-creator`, superpowers `writing-skills`); files a skill tells the agent to *create* (openai `hatch-pet`, microsoft `wiki-onboarding`, `wiki-ado-convert`); repo-root or plugin-root scripts (alirezarezvani `scripts/convert.sh`, trailofbits `${RUST_REVIEW_PLUGIN_ROOT}/scripts/...`); a placeholder name (`references/filename.md`, awesome-copilot `quality-playbook`); optional files ("if `references/firm-standards.md` is present", awesome-copilot `d365-solution-blueprint`).

Not a scanner defect: ECC `postgres-patterns` (ja-JP, zh-TW) `[Supabase Agent Skills](Supabase Agent Skills (credit: Supabase team))` is a link whose URL was lost in translation. The target is reported as `Supabase`; the real problem is upstream.
