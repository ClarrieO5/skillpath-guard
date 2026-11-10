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

## v0.2.2 (2026-11-10)

- Local suite: 80 passed. Hosted matrix green on `main` at cc739d3 ([run 42781586690](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42781586690)) and on tag `v0.2.2` ([run 42781732941](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42781732941)). Release check against the published tag passed ([run 42781733481](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42781733481)).
- Clean install checks (session 5, empty `HOME` and npm cache, Node 22, npm 10.9): `npm install <packed tarball>` then `npx skillpath-guard --version` and a scan of `examples/broken` (exit 1, as expected); `npx --yes github:ClarrieO5/skillpath-guard#v0.2.2 scan skills` on the valid fixture (exit 0). `skillpath-guard` is not on the npm registry (404).

## v0.3.0 (prepared 2026-11-10, not released)

- Local suite: 87 passed, `npm run verify` passes (Node 22.23). Hosted matrix on `main` at a44b885 (PR #15 merged): [run 42789258700](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42789258700), green.
- Consumer-repository test of the Action (`docs/external-action-test/`): **not run on GitHub.** The session could not create a repository (tooling for repository creation was disabled; only `ClarrieO5/skillpath-guard` was reachable). Local simulation of the Action's shell step on a copy of the kit, in a separate directory: valid skill exit 0; broken link exit 1 (`MISSING_REFERENCE ... references/missing.md`, annotation emitted); shared link without `allow-shared` exit 1 (`PATH_ESCAPE`, message names the flag), with it exit 0 (`SHARED_REFERENCE` warning); `exclude` with a blank-padded line skips the broken vendored skill; `summary: false` writes 0 bytes, default writes 234-706 bytes. This is not evidence that the hosted Action works from another repository.
- Hosted consumer run URLs: *to be added*.

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
