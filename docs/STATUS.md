# Project status and handoff

Snapshot: **2026-11-10**. Read this first when continuing in a new session. Keep it current: update it at the end of every session.

## Where things stand

| Item | State |
|---|---|
| Latest release | [v0.2.1](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.2.1), pre-release, tag at `main` f1802cd. First tag that contains the GitHub Action. |
| Tests | 77 pass locally; `npm run verify` passes. |
| CI | All nine `quality` jobs green on `main`, on the tag, and on release PR #11. `release-check` passed against the published tag. Links in `docs/VALIDATION.md`. |
| Real usage | 0 repositories use the Action (code search, 2026-11-10). No external issues, PRs or users. |
| Upstream PRs merged | 0. |
| Internal PRs | #10 and #11 merged. **#9** (older draft from another session) is still open; its two scanner fixes are already in `main`, so it can be closed as superseded. |

## Waiting on you (nothing below has been done)

1. **awesome-copilot GDPR fix: ready to submit.** Your fork `ClarrieO5/awesome-copilot` exists (at upstream e45ee93), but the fix branch has not been pushed to it.
   - To have Claude push it: start a session and say "push the awesome-copilot GDPR branch to my fork". It needs `ClarrieO5/awesome-copilot` added to the session with push access.
   - To do it yourself:
     1. Clone your fork.
     2. `git checkout -b fix-gdpr-compliant-reference-paths`
     3. `git am <path-to>/skillpath-guard/docs/patches/awesome-copilot-gdpr-compliant.patch`
     4. Push the branch, then open a PR to `github/awesome-copilot` `main`.
   - PR title and description: `docs/drafts/awesome-copilot-gdpr-compliant-PR.md`.
2. **Close PR #283** in shanraisshan/claude-code-best-practice as a duplicate of #142. Comment text: `docs/CONTRIBUTION_LEDGER.md`.
3. **Close internal PR #9** as superseded (optional).
4. **Verify the Action from a separate repo:** create a throwaway public repo with one skill and the workflow in `docs/LAUNCH.md`, push a valid version and then a broken one, and record both run links in `docs/VALIDATION.md`.
5. Decide on the remaining prepared fixes (`docs/CONTRIBUTION_LEDGER.md`):
   - **wshobson/agents:** read their issue #447 first; it may have been declined.
   - **microsoft/skills:** needs the Microsoft CLA.
   - **firebase, anthropics/skills, nature-skills:** issues only.

## Next work for an AI session

- After the awesome-copilot PR is open: subscribe to it, respond to review, and record the outcome in the ledger and `docs/IMPACT_LOG.md`.
- wshobson: read issue #447, then decide whether to re-validate the patch. Their `make validate`, `make garden` and `make test` have **not** been run; `evals/static-score-snapshot.json` may need `make eval-snapshot`.
- microsoft/skills: the patch applies to 84666ab; re-check upstream before submitting.
- Do not repeat the round-2 research (`docs/CONTRIBUTION_RESEARCH_2026-11.md`) unless upstream changed. Recheck with a fresh `git clone --depth 1` and `git log -1`.
- Re-run the usage searches monthly (see `docs/LAUNCH.md`) and log real numbers only.

## Session constraints learned (so the next session doesn't rediscover them)

- **GitHub scope:** sessions are scoped to `ClarrieO5/skillpath-guard`. Other repos must be added with `add_repo` (push access for your fork). Public repos can still be cloned read-only.
- **Search:** use `gh api -X GET search/issues|code|commits`. The secondary rate limit trips after about 10 quick queries, so wait about 4 seconds between calls.
- **Third-party code:** running another repo's scripts (`npm start`, `make ...`) is blocked by the permission system unless you explicitly ask for it in that session. Install with `npm ci --ignore-scripts`.
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
- Release and outreach: `docs/RELEASE.md`, `docs/RELEASE_NOTES_v0.2.1.md`, `docs/CHANGELOG.md`, `docs/LAUNCH.md`, `docs/ADOPTION.md`.
