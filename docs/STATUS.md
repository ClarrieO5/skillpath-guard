# Project status and handoff

Snapshot: **2026-11-10** (eighth session: real-world validation, comparison, Marketplace and README work on top of the published v0.3.2; PR open, nothing merged or released). Read this first when continuing in a new session. Keep it current: update it at the end of every session.

## Where things stand

| Item | State |
|---|---|
| Latest release | [v0.3.0](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.3.0) is the last correct release. [v0.3.1](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.3.1) is a published pre-release **created in error** (tag at 4053f81, package version 0.3.0); preserved, not to be used. Not on npm. |
| Adoption audit | Merged as PR #15 (a44b885); hosted `quality` green ([run 42789258700](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42789258700)). Report: `docs/ADOPTION_AUDIT_2026-11.md`. |
| v0.3.2 | Published (tag `v0.3.2`, npm `skillpath-guard@0.3.2`, verified installable from a clean directory on 2026-11-10). |
| v0.3.3 | Released 2026-11-10: tag `v0.3.3` = `main` = 67e456c (pre-release); `release-check` ([run 42898781863](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42898781863)) and tag-push `quality` ([run 42898780384](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42898780384)) green. Published to npm by the maintainer; `npx --yes --prefer-online skillpath-guard@0.3.3 --version` prints 0.3.3. |
| Consumer-repo Action test | `ClarrieO5/skillpath-guard-consumer-test`: 6 jobs green at `@v0.3.0` ([run 42794375114](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42794375114)). Earlier runs 1-4 were red from test-workflow mistakes (`docs/VALIDATION.md`). Not yet at `@v0.3.1`. Job-summary content not verified by eye. **Not yet re-run at `@v0.3.3`:** the session could not attach that repository (denied), so the maintainer must run it. |
| npm | `skillpath-guard` versions on the registry: `0.0.0-stage` (origin not recorded), `0.3.2`, `0.3.3`; `latest` = 0.3.3. Published by the maintainer manually (no npm auth in sessions). Right after publishing, installs of 0.3.3 failed with ETARGET for a few minutes (registry delay); `--prefer-online` fixed the local cache. Steps: `docs/RELEASE.md`. |
| Tests | 90 pass; `npm run verify` passes (Node 22 locally; CI covers 20/22/24). |
| Real usage | 0 repositories use the Action (last searched 2026-11-10). No external users. |
| Upstream PRs | Merged 0. Open 2: [github/awesome-copilot#6339](https://github.com/github/awesome-copilot/pull/6339) (awaiting a maintainer; bot checks and two Copilot reviews positive, no change requests) and shanraisshan/claude-code-best-practice#283 (duplicate of #142). |
| Internal PRs | #9 (old draft, superseded) still open. |

## v0.2.2: done

Released 2026-11-10; run links recorded in session 5. "Stable" (not a pre-release) is a separate decision. The release gate still lists independent human review and real-runtime validation as outstanding. Also open: the Action has never run from another repo, and `AMBIGUOUS_CWD` has never been precision-checked. None of these block a v0.2.2 pre-release.

## Waiting on you (nothing below has been done)

1. **v0.3.2 release PR:** review, check CI, merge when ready to publish; then release `v0.3.2` targeting `main` (pre-release), and `npm publish` from the tag (`docs/RELEASE.md`). Optionally edit the `v0.3.1` release body to say it is superseded (text in `RELEASE_NOTES_v0.3.1.md`). Separate decisions: Marketplace (`docs/MARKETPLACE.md`), outreach (`docs/FIRST_USERS_PLAN.md`).
2. **firebase/agent-skills** (PR; re-verified 2026-11-10: upstream unchanged at 99954a3, no duplicate, `skills-ref` fails before and passes after). Sign the Google CLA first: https://cla.developers.google.com/ . Then fork, `git am docs/patches/firebase-agent-skills-data-connect-name.patch`, `git commit --amend --reset-author --no-edit` (with your CLA email), push, and open a PR to `main` using `docs/drafts/firebase-agent-skills-data-connect-name-PR.md`.
3. **wshobson/agents** (PR; upstream unchanged at 9c61ab2, no duplicate). The description, in their template, is in `docs/drafts/wshobson-agents-ml-pipeline-workflow-PR.md`. Their `make validate STRICT=1 / garden / test` were **not** run: the permission system blocked them. Either run them locally, or submit with those boxes unticked and let their CI run them.
4. **tech-leads-club/agent-skills** (issue, not PR: the repo is issue-first): `docs/drafts/tech-leads-club-routing-names-ISSUE.md`.
5. **PR #283:** close it (with or without the drafted comment) or leave it open. Unchanged.
6. Optional: close internal PR #9; verify the Action from a throwaway repo (`docs/LAUNCH.md`).
7. **awesome-copilot #6339:** nothing to do unless a maintainer asks for changes.

Withdrawn on 2026-11-10 (do not submit): microsoft/skills (already reported in #422/#464, fix PR #448 open), anthropics/skills `claude-api` (3 issues and 6 PRs already open), nature-skills (deliberate, allowlisted alias).

## Session 8 results (2026-11-10)

- `docs/REAL_WORLD_VALIDATION.md`: 25 repos, exact SHAs, v0.3.2 results and triage. `docs/COMPARISON.md`: measured fixtures (`docs/evidence/comparison/`) vs skills-ref and vat. Blocked by the permission system and therefore NOT measured: building `agent-ecosystem/skill-validator` (Go) and running `skillspec-check`.
- `docs/MARKETPLACE_READINESS.md` has the owner's exact steps. Name uniqueness and the Developer Agreement remain unverified/owner-only.
- Open follow-ups: plugin-root script cue for MISSING_REFERENCE (trailofbits), PATH_ESCAPE line-by-line triage, hosted CI result for the PR, consumer repo at the new tag.

## Next work for an AI session

- After the v0.3.2 tag: re-run the consumer repo at `@v0.3.2` and record the run; after an approved npm publish, verify `npx skillpath-guard@0.3.2` from a clean directory. Do not publish to npm or the Marketplace without approval.
- The 12-repo first-run test (`docs/ADOPTION_AUDIT_2026-11.md`) is the adoption benchmark: re-run it with fresh clones after any rule change and compare repos failing / errors / warnings.

- After any external PR is opened: subscribe to it, respond to review, and record the outcome in the ledger and `docs/IMPACT_LOG.md`.
- Before submitting anything, re-run the duplicate searches in the ledger. Round 2 missed existing reports for two candidates; search by file name and by skill name, for both issues and PRs.
- Scanner: the remaining false-positive classes are listed in `docs/CORPUS_VALIDATION.md` (round 3). They need semantic cues, not syntax. Do not add a heuristic without a corpus before/after diff that is reviewed line by line.
- Round 4 (14 repos, see the ledger) found no new scanner bug. In modern repos most errors are `PATH_ESCAPE` links to sibling skills that exist (googleworkspace 75, databricks 456). Flagging an escaping link whose target is missing was considered and rejected: 2 of 7 such links were real breakage, and both were already fixed in an open PR.
- `AMBIGUOUS_CWD` (1,518 findings in round 3) has never been precision-checked. A seeded sample of about 30 would say whether it is useful as a default warning.
- Do not repeat rounds 2-3 unless upstream changed. Recheck with a fresh `git clone --depth 1` and `git log -1`.
- Re-run the usage searches monthly (see `docs/LAUNCH.md`) and log real numbers only.

## Session constraints learned (so the next session doesn't rediscover them)

- **GitHub scope:** sessions are scoped to `ClarrieO5/skillpath-guard`. Other repos must be added with `add_repo` (push access for your fork). Public repos can still be cloned read-only.
- **Search:** use `gh api -X GET search/issues|code|commits`. The secondary rate limit trips after about 10 quick queries, so wait about 4 seconds between calls.
- **docs.github.com** is not reachable (DNS blocked); read GitHub docs from `raw.githubusercontent.com/github/docs/main/content/...`. github.com HTML pages return 403 to curl.
- **Third-party code:** running another repo's scripts (`npm start`, `make ...`, `uv run tools/...`) is blocked by the permission system, even when the task asks for "validation where permitted" (confirmed again in session 4). Standalone tools (mdformat, markdownlint-cli2, skills-ref) run fine from a scratch venv or node_modules. Install with `npm ci --ignore-scripts`.
- **Other repos' PR comments:** `gh api` only works for attached repos; the web-fetch agent can read a public PR page.
- **Branches:** after a squash merge, do not force-push the old branch (blocked). Restart it from `main`, or merge the old tip with `-s ours` after checking that its tree equals `main`.
- **Clones and scans** live in the session scratchpad and do **not** persist. Patches and drafts that must survive are in `docs/patches/` and `docs/drafts/`.
- **Tags:** use lowercase `v` from now on. `V0.2.0` (capital V) exists, predates `action.yml`, and must not be moved.
- **Releases:** follow `docs/RELEASE.md`. Bump the version in `package.json`, `src/cli.mjs` (two places), `src/core.mjs` and `tests/cli.test.mjs`, and update the tag in `.github/workflows/release-check.yml`.

## Rules (from the maintainer)

Do not merge, publish, submit external issues or PRs, or contact maintainers without explicit approval. No low-value PRs to raise counts. Never fabricate results; record failures too.

## File map

- Code: `src/cli.mjs`, `src/core.mjs` (rules), `src/references.mjs` (extraction); tests in `tests/`; release gate `scripts/verify.mjs`; Action `action.yml`.
- Evidence: `docs/VALIDATION.md`, `docs/IMPACT_LOG.md`, `docs/RUNTIME_EVIDENCE.md`, `docs/CORPUS_VALIDATION.md`.
- Contributions: `docs/CONTRIBUTION_LEDGER.md` (status of every external item), `docs/CONTRIBUTION_RESEARCH_2026-11.md` (round 2 evidence), `docs/EXTERNAL_CONTRIBUTIONS.md` and `docs/CONTRIBUTION_CANDIDATES.md` (round 1), `docs/patches/`, `docs/drafts/`.
- Adoption audit (session 5): `docs/ADOPTION_AUDIT_2026-11.md`.
- Consumer test kit: `docs/external-action-test/`.
- Release and outreach: `docs/RELEASE.md`, `docs/RELEASE_NOTES_v0.3.0.md`, `docs/RELEASE_NOTES_v0.2.1.md`, `docs/CHANGELOG.md`, `docs/LAUNCH.md`, `docs/ADOPTION.md`.
