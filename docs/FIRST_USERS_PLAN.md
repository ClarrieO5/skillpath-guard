# Plan: the first five independent users (drafts; nothing has been sent)

"Independent user" = a person or repository not controlled by the maintainer that runs SkillPath Guard (CLI or Action) on their own skills **and** can say what happened. Today: 0 known (searched 2026-11-10). Stars, forks, downloads and this account's repos do not count.

## What a user needs first (before any outreach)

1. A README whose first screen is: what it catches (for example `[guide](references/guide.md)` pointing at a file that does not exist; see `examples/broken`), one install line, one CI snippet. Move launch/research links down (adoption audit, section 5).
2. The pitch is a finding, not a tool: "your `references/x.md` link is broken when the skill is installed alone". Every contact leads with a verified bug in *their* repo.
3. A false-positive feedback path: only `.github/ISSUE_TEMPLATE/bug_report.md` exists today. Add a "false positive" template (a small change, not done here).

## Realistic funnel (small numbers on purpose)

| Step | Action | Target | Needs approval |
|---|---|---|---|
| 1 | Trial by two people from the README alone (friends/colleagues who write skills). Watch or ask where they stall; record verbatim, including "not useful" | 2 trials | yes (you pick who) |
| 2 | Fix-first contributions already prepared: firebase/agent-skills, wshobson/agents, tech-leads-club issue (see `docs/CONTRIBUTION_LEDGER.md`). Each is useful with no mention of the tool beyond "found with". Maintainers who merge are the warmest leads | 3 submitted, maybe 1 to 2 merged | yes, per item (CLA for firebase) |
| 3 | After a merge, ask that maintainer one question: "would CI link checking help you? here is a 6-line workflow" | 1 to 2 adopters | yes |
| 4 | One post in the Agent Skills spec community asking only for false-positive reports on real repos | 1 to 3 replies | yes |
| 5 | Bundle-style repos that failed on `PATH_ESCAPE` in the audit (googleworkspace, cloudflare passed with `allow-shared`): offer the `allow-shared` snippet in an issue only where the findings were verified real | 0 to 2 | yes, per repo |

Expected honest outcome within about 8 weeks: 1 to 3 users, mostly from step 1 and 2. Five is possible but not likely without a maintainer champion. Do not buy stars, post in many places, or count your own test repos.

## Measure (only real numbers)

- GitHub code search for `ClarrieO5/skillpath-guard@` excluding this owner, monthly (searches described in `docs/LAUNCH.md`).
- External issues and PRs on this repo; replies to step 1 to 4.
- npm downloads only after an approved publish, and they include bots/mirrors: treat as a weak signal.
- Log each month in `docs/IMPACT_LOG.md`, including "0".

## Stop condition

If after step 1 to 4 nobody outside uses it, offer the link-target checks to `skills-ref` maintainers instead of growing a parallel tool (audit, section "Adoption plan").

## Candidate improvements users would feel

SARIF output for code scanning; `--fix` suggestions for case mismatches; a pre-commit hook. Build only if a trial user asks.
