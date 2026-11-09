# Launch kit (drafts only; nothing has been posted)

## Current usage, measured 2026-11-10

- GitHub code search for `skillpath-guard` in `.github/workflows`: **0** repositories.
- Code search for `"ClarrieO5/skillpath-guard"`: 3 hits, all in `findscripter/everything-skills`, an automated catalogue of repositories that contain `SKILL.md` files. This is a listing, **not** usage.
- External issues, PRs or stars from unaffiliated users: none recorded.

Re-run these searches monthly and record the numbers in `docs/IMPACT_LOG.md`. Count unique repositories, never your own.

## Before announcing (blockers)

1. **Merge the internal PR and tag a release** (suggest `v0.2.1`, lowercase like `v0.1.0`; the mixed `V0.2.0` tag has already confused the docs once). The `V0.2.0` tag predates `action.yml`, so `uses: ClarrieO5/skillpath-guard@V0.2.0` fails. The v0.2.1 release PR already switches the README to `@v0.2.1`, so tag immediately after merging it.
2. Verify the Action from a **separate** repository (not this one): create a throwaway public repo with one skill and the workflow below, push, and confirm the run passes; then add a broken link and confirm it fails with an annotation. Record the run URLs in `docs/VALIDATION.md`.
3. Get one person other than you to follow the README from scratch.

Install instructions checked 2026-11-10: the composite action script runs with `examples/valid` (exit 0), `examples/broken` (exit 1) and `strict: true` (exit 0); `action.yml` exists at f6eaa00. Not yet checked: a run from an external repository.

```yaml
# .github/workflows/skills.yml
name: Skill links
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ClarrieO5/skillpath-guard@<tag-or-full-sha>
        with:
          path: skills
```

## Projects that could genuinely benefit

Evidence from `docs/CONTRIBUTION_RESEARCH_2026-11.md`. Lead with the fix, not the tool: mention SkillPath Guard only as "found with", and suggest CI only if the maintainer asks how to prevent a repeat.

| Repository | Why | Existing checks |
|---|---|---|
| github/awesome-copilot (478 skills) | Real case bug that only appears on Linux | `skill:validate` (not run here; may not check link targets or case) |
| microsoft/skills (210 skills) | Dead links plus 10 dangling skill symlinks (fixed by open PR #414) | Has a test harness; excluded microsoft-foundry from a SKILL.md existence test |
| wshobson/agents (185 skills) | Dead pointers missed by its own `DEAD_CROSS_REF` checker | Strong in-house tooling; likely **not** an adopter, but a source of false-positive comparisons |
| firebase/agent-skills | Name/folder mismatch | mdformat only |

Do not pitch the tool to repositories where you have not found a real problem.

## Announcement draft

Title: **SkillPath Guard: catch broken file links in Agent Skills before your users do**

> Agent Skills (`SKILL.md`) often point to `references/`, `scripts/` and `assets/` files. When a file is renamed, moved, or differs only by letter case, the skill still looks fine on macOS but breaks on Linux and in CI.
>
> SkillPath Guard is a small, offline, dependency-free Node.js CLI and GitHub Action that checks those links: missing files, case mismatches, paths that escape the skill folder, absolute paths, dangling symlinks, and basic `name`/`description` rules.
>
> I tested it on 33 public skill repositories (about 3,400 skills) and hand-checked every missing-file report; the false positives I found are fixed, and the real bugs are being reported upstream. It is experimental (v0.2): please report false positives with the Markdown line that caused them.
>
> MIT licensed: https://github.com/ClarrieO5/skillpath-guard. It complements `skills-ref` (the reference validator), which checks frontmatter in more depth.

Before posting, replace "are being reported upstream" with the real count of merged fixes, if any.

## Where to share (check each community's rules first; post once, not everywhere)

1. **agentskills/agentskills** GitHub Discussions, if enabled (the spec's home; most relevant audience). Check whether tool announcements are welcome.
2. **Awesome lists**, via their own submission process: travisvn/awesome-claude-skills, VoltAgent/awesome-agent-skills, hesreallyhim/awesome-claude-code. Read each CONTRIBUTING file; some require a minimum age, stars or usage.
3. **r/ClaudeAI** or the Claude Developers Discord tool-sharing channel, following their self-promotion rules.
4. **Show HN**, only after at least one external user or merged upstream fix, so the post has substance.

## Tracking feedback

- Log every external issue, PR, star or workflow adoption in `docs/IMPACT_LOG.md` with date and link.
- Ask reporters' permission before quoting them.
- Never count your own repositories, test runs, or this project's CI.
