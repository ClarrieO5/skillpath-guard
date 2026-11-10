# Project status and handoff

Snapshot: **2026-11-10**. Read this first when continuing in a new session. Keep it current: update it at the end of every session.

## Where things stand

| Item | State |
|---|---|
| Latest release | [v0.2.1](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.2.1), pre-release, tag at `main` f1802cd. First tag that contains the GitHub Action. |
| Unreleased on a branch | Three scanner fixes from the round-3 re-scan (footnotes, `:line` suffixes, web routes), in the PR stacked on #12. Not released. |
| Tests | 80 pass locally; `npm run verify` passes. |
| CI | All nine `quality` jobs green on `main`, on the tag, and on release PR #11. `release-check` passed against the published tag. Links in `docs/VALIDATION.md`. |
| Real usage | 0 repositories use the Action (code search, 2026-11-10). No external issues, PRs or users. |
| Upstream PRs merged | 0. Open: 1 (#283, fully overlapped by #142). |
| Internal PRs | **#12** (docs refresh) open. A second PR, **stacked on #12**, has the round-3 scanner fixes and ledger corrections. **#9** (older draft) is still open; its scanner fixes are already in `main`, so it can be closed as superseded. |

## Waiting on you (nothing below has been done)

1. **Review and merge internal PRs:** first #12, then the stacked round-3 PR. If #12 is squash-merged and its branch deleted, GitHub retargets the stacked PR to `main`. If it shows #12's commits again, ask Claude to rebase it onto `main`.
2. **Decide on PR #283** (shanraisshan/claude-code-best-practice). It overlaps #142 completely (re-verified 2026-11-10). Options:
   - (a) close it without a comment;
   - (b) close it with the drafted comment in `docs/CONTRIBUTION_LEDGER.md`;
   - (c) leave it open.

   Either close is a public action; nothing has been done.
3. **awesome-copilot GDPR fix: pushed to your fork, PR not opened.** Branch [`fix-gdpr-compliant-reference-paths`](https://github.com/ClarrieO5/awesome-copilot/tree/fix-gdpr-compliant-reference-paths) (commit a854019) is the patch applied on upstream `main` 6afbe78 (re-checked 2026-11-10: still broken, no duplicate). SkillPath Guard: 4 errors before, 0 after.
   - To submit: open https://github.com/github/awesome-copilot/compare/main...ClarrieO5:awesome-copilot:fix-gdpr-compliant-reference-paths?expand=1 and paste the title and body from `docs/drafts/awesome-copilot-gdpr-compliant-PR.md`.
4. **firebase/agent-skills name fix: ready, needs the Google CLA.** Patch `docs/patches/firebase-agent-skills-data-connect-name.patch`, description `docs/drafts/firebase-agent-skills-data-connect-name-PR.md`. Fork the repo, `git am` the patch, and make sure the commit email is your CLA email (`git commit --amend --reset-author --no-edit`). Then open a PR to `main`.
5. **wshobson/agents:** the #447 question is resolved (it was fixed, not declined), so the patch is a reasonable PR. Before submitting, someone must run their `make validate STRICT=1`, `make garden` and `make test` (third-party code; not run here).
6. **Close internal PR #9** as superseded (optional).
7. **Verify the Action from a separate repo:** create a throwaway public repo with one skill and the workflow in `docs/LAUNCH.md`, push a valid version and then a broken one, and record both run links in `docs/VALIDATION.md`.

Withdrawn on 2026-11-10 (do not submit): microsoft/skills (already reported in #422/#464, fix PR #448 open), anthropics/skills `claude-api` (3 issues and 6 PRs already open), nature-skills (deliberate, allowlisted alias).

## Next work for an AI session

- After any external PR is opened: subscribe to it, respond to review, and record the outcome in the ledger and `docs/IMPACT_LOG.md`.
- Before submitting anything, re-run the duplicate searches in the ledger. Round 2 missed existing reports for two candidates; search by file name and by skill name, for both issues and PRs.
- Scanner: the remaining false-positive classes are listed in `docs/CORPUS_VALIDATION.md` (round 3). They need semantic cues, not syntax. Do not add a heuristic without a corpus before/after diff that is reviewed line by line.
- `AMBIGUOUS_CWD` (1,518 findings in round 3) has never been precision-checked. A seeded sample of about 30 would say whether it is useful as a default warning.
- Do not repeat rounds 2-3 unless upstream changed. Recheck with a fresh `git clone --depth 1` and `git log -1`.
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
