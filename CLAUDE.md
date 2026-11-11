# SkillPath Guard: notes for Claude sessions

Start by reading `docs/STATUS.md` (current state, what is waiting on the maintainer, next work, and environment constraints). Update it before ending a session.

- Rules: do not merge, publish, tag, submit external issues or PRs, or contact maintainers without the maintainer's explicit approval. No low-value PRs. Never fabricate results.
- Check before pushing: `npm test` and `npm run verify` (Node 20+, no dependencies). Add a regression test in `tests/regressions.test.mjs` for every behaviour change.
- Status of every external contribution: `docs/CONTRIBUTION_LEDGER.md`. Do not repeat research in `docs/CONTRIBUTION_RESEARCH_2026-11.md` unless upstream changed.
- Releases: follow `docs/RELEASE.md`; lowercase `v` tags.
