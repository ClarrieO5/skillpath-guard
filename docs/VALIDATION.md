# Validation evidence

Date: 9 November 2026. Local environment: Linux, Node v24.22.1.

- Supplied prototype: **9 tests passed** before edits.
- First added regression suite: **18 tests, 8 passed / 10 failed** against the prototype. Failures reproduced links, path checks and baseline defects; then fixed.
- Current local suite: **50 passed, 0 failed, 0 skipped**. See [recorded output](evidence/local-tests.txt).
- `npm run verify`: passed unit/regression/CLI suite and valid, broken, and baseline exit contracts.
- `npm pack --dry-run`: passed. Packed tarball extracted in a fresh directory and its CLI scanned the valid fixture successfully. No npm registry publication performed; `private: true` intentionally prevents accidental publication.
- Public corpus: ten skills scanned; no errors, five uncertain cwd warnings. See [research](RESEARCH_LOG.md).
- Independent users, live agent experiments, and human code review: **not completed**.
- First hosted 49-test matrix: [Actions run 42578477378](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42578477378). Final **50-test matrix passed all nine jobs**: [run 42578691493](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42578691493), commit `861a7fcb826e6f1483253df59da1dbdba97aea25`.
- A fresh public clone independently ran the 49-test candidate suite and final 50-test verification successfully in this same environment. This is a clean-checkout check, not an independent user trial.

## v0.2.1 (2026-11-10)

- Local suite: **77 passed, 0 failed**; `npm run verify` and `npm pack --dry-run` (version 0.2.1, 31 files) pass.
- Hosted matrix (Linux/macOS/Windows x Node 20/22/24), all nine jobs green, including the new check that the Action **fails** on `examples/broken`:
  - release PR #11: [run 42715428388](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42715428388)
  - `main` at f1802cd: [run 42715961477](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42715961477)
  - tag `v0.2.1`: [run 42716651940](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42716651940)
- Release check against the published tag (`uses: ClarrieO5/skillpath-guard@v0.2.1`; valid passes, broken fails, CLI prints 0.2.1): [run 42716652601](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42716652601).
- Public corpus: 33 repositories (3,375 skills); see `docs/CONTRIBUTION_RESEARCH_2026-11.md`.
- Still not done: a run from a separate consumer repository, independent users, human code review.

The sections above and below this one describe v0.1.0 (9 November) and are kept as history.

## Reproduce

```sh
npm test
npm run verify
node src/cli.mjs scan examples/valid
node src/cli.mjs scan examples/broken --format md
node src/cli.mjs scan examples/broken --format json --out reports/baseline.json
node src/cli.mjs scan examples/broken --baseline reports/baseline.json --fail-on-new --strict
```

The third scan above deliberately exits 1; the baseline comparison exits 0. Tests cover added and resolved findings, malformed baselines, strict mode, usage failures, annotation escaping, JSON parsing, reference syntax, case, metadata and symlink escape.

## Live runtime protocol — not yet executed

Use an original disposable skill containing `references/guide.md`. Record runtime/version, OS, install location, prompt, and actual accessed file. Run once from the source folder, once installed outside an unrelated workspace, and once after explicitly resolving resources against the skill directory. Redact private paths. Static warnings and third-party issue reports cannot substitute for this experiment.
