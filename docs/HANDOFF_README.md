# SkillPath Guard: session handoff (read this first in a new session)

Last updated 2026-11-09 after PR #8. Everything below was verified in the sessions described, unless marked **unverified**. Re-check live state (`git log`, release page, open PRs) before relying on it.

## What the project is
`ClarrieO5/skillpath-guard`: an experimental, dependency-free, offline Node.js (>=20) CLI that statically checks Agent Skills packages (`SKILL.md`): missing/escaping/absolute/case-mismatched resource paths, symlink problems, basic frontmatter rules, cwd-ambiguity warnings, baselines for CI. MIT. Not an official Anthropic tool. Not on npm (`package.json` is `private`). Entry: `node src/cli.mjs scan <dir>`; code in `src/core.mjs` (rules) and `src/references.mjs` (reference extraction); tests in `tests/` (`npm run verify`, currently **71 tests**); composite GitHub Action in `action.yml`.

## State
- Released: **v0.1.0** and **v0.2.0** as pre-releases. The v0.2.0 tag is **`V0.2.0` (capital V)** at commit `a3ecd1b`; `v0.2.0` does not exist. Post-release fixes are on `main` (PRs #2-#8 merged), unreleased: placeholder-link/output-path false-positive fixes, `action.yml`, beginner README. Next version would be 0.2.1 (version strings are in `package.json`, `src/cli.mjs`, `src/core.mjs`, and `tests/cli.test.mjs`).
- The owner said the GitHub Action was tested in a separate repository (their statement; not verified by me).
- Main CI (9 jobs: ubuntu/macos/windows x Node 20/22/24) passed at last check.

## Key documents (all in `docs/`)
`CHANGELOG.md`, `RELEASE_NOTES_v0.2.0.md`, `CORPUS_VALIDATION.md` (corpus run, with corrections), `COMPARISON.md` (source-only comparison with `skills-ref` and `@vibe-agent-toolkit/agent-skills`), `RUNTIME_EVIDENCE.md` (one Claude Code trial), `ADOPTION.md` (official eligibility terms, plan, unsent outreach draft), `CONTRIBUTION_CANDIDATES.md`, `EXTERNAL_CONTRIBUTIONS.md` (ranked upstream fixes + submission steps), `patches-claude-code-best-practice-agent-browser.diff`.

## Verified findings (and caveats)
- Corpus: 23 public repos cloned/scanned 2026-11-09 (21 contain skills); 11,864 skills including mirrored copies (9,013 are in `sickn33/agentic-awesome-skills`). Counts are findings, not accuracy. Precision spot check: 23 of 24 sampled MISSING_REFERENCE findings genuine (small, single reviewer). AMBIGUOUS_CWD is **unvalidated**.
- Fixed by this work: dangling SKILL.md symlink, Windows paths in links, markdown-fence examples, bare folder mentions (incl. with punctuation), link syntax in code, `[x](url)` placeholders, output paths (`-o x`), quadratic scan (562-skill repo 8.9s to 0.56s), Unicode names, `compatibility` > 500.
- Comparison: **never run** other validators; installs (`pip install skills-ref`, npm packages) were denied by the permission classifier three times and were not bypassed. Comparison is by reading source only.
- Runtime: one positive Claude Code trial (`claude -p`, skill-relative link resolved). Does not validate `AMBIGUOUS_CWD` or `../shared` behaviour.

## Upstream contribution candidates (NOTHING submitted; needs owner approval each)
1. `shanraisshan/claude-code-best-practice`: 9 dead links in `.claude/skills/agent-browser/SKILL.md` (PR; patch prepared).
2. `Yuan1z0825/nature-skills`: `name: researchwrite` vs folder `nature-proposal-writer` (issue first).
3. `anthropics/skills`: `claude-api` description 1,068 chars vs 1,024 limit (issue).
Details and beginner steps: `docs/EXTERNAL_CONTRIBUTIONS.md`.

## Remaining / ideas (not started unless noted)
SARIF output; follow in-repo SKILL.md symlinks; `--ignore` for mirrored trees; split rule for `../sibling` links; root-relative web routes flagged as absolute (rare FP); allowed-field and YAML checks; real runtime tests; independent user trial; run the competitor validators if permission is granted; decide whether to cut a lowercase `v0.2.1` release.

## Rules the owner set (follow them)
- Do **not** merge PRs, publish releases/npm, open issues/PRs in other repos, or contact anyone without explicit approval.
- Do not bypass denied permissions; report blockers.
- Do not invent metrics or inflate GitHub activity; adoption evidence must be genuine (external repos using the action, external issues/PRs). Never claim Anthropic eligibility.
- Owner has limited Claude usage: one focused pass, no unnecessary subagents or repeated research, short reports, small tested commits, push to a branch and open a PR.
- Attribution: commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and a `Claude-Session:` line; PR bodies end with the "Generated with Claude Code" line and session link (from the harness reminder at the time). GitHub comments get the footer required by the environment.

## Practical notes
- GitHub MCP tools need `ToolSearch` (`select:mcp__github__create_pull_request`, etc.); `gh` works only via REST and only for the session's repo scope (GraphQL blocked; other repos need `add_repo`). `git clone` of public repos works through the proxy.
- Sandboxed corpus clones lived in `/tmp/claude-0/corpus` and are lost when the container ends. Re-clone the repos listed in `docs/CORPUS_VALIDATION.md` to reproduce.
- Official programme terms: https://www.anthropic.com/claude-for-oss-terms (re-read before applying; thresholds were: 500+ dependents / 100+ dependent packages, 200k monthly downloads, 100+ merged external PRs in 12 months, 20+ external contributors, etc., plus general requirements). SkillPath Guard currently meets none of these.
