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
- **Hosted consumer-repository test** (public repo `ClarrieO5/skillpath-guard-consumer-test`, workflow uses `ClarrieO5/skillpath-guard@main` = a44b885, i.e. the Action with the new inputs, before the version bump). Five runs, three of them red because of defects in the test workflow itself, not the Action:
  - [run 1](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42790624458): **failed to start**, no jobs. My workflow YAML was invalid (an unquoted `: ` in a job name).
  - [run 2](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42790742726): 4 of 5 jobs green; `summary-on-off` red. My assertion read `$GITHUB_STEP_SUMMARY` in a later step, but GitHub gives each step its own summary file.
  - [run 3](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42790904612) and [run 4](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42791058642): same job red again. Even with `GITHUB_STEP_SUMMARY` redirected to a shared path (the variable did reach the Action step), the file was gone by the next step, and a 5 ms polling watcher captured nothing. The runner appears to consume the file after each step. **Inconclusive: this does not show the Action failed to write the summary.**
  - [run 5](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42791209903) at 2f29bcd: **all 6 jobs green** (summary split into `summary-on` and `summary-off`).
- Results in run 5 (assertions in the workflow, checked in the job logs/conclusions):
  - `valid-passes`: Action step succeeded on the valid skill.
  - `broken-fails`: Action step failed (outcome `failure`) on `references/missing.md`; the log shows `ERROR MISSING_REFERENCE broken-skill/SKILL.md:8 Referenced file does not exist: references/missing.md`.
  - `shared-default-fails-allow-shared-passes`: without `allow-shared` the step failed; with `allow-shared: 'true'` (and a two-line `exclude`) it succeeded.
  - `exclude-works`: `vendored/` fails alone; passes when excluded via the multi-line input, including a line with extra leading spaces.
  - `summary-on` / `summary-off`: both Action steps failed on the broken skill as asserted. **The summary content itself was not verified by automation.** To check by eye: open the two jobs' Summary tab (on should show the Markdown report, off should show none). Local simulation (summary on wrote 234-706 bytes, off wrote 0) is the only other evidence.
- **Defect found by the hosted run:** annotation messages contain a literal `%3A` (`Referenced file does not exist%3A references/missing.md`), because `src/core.mjs:308` also percent-escapes `:` and `,` in the message (only needed in properties). Cosmetic; present since earlier versions; not fixed in this PR.
- Node.js 20 deprecation warning appears for `actions/checkout@v4` in the consumer runs (harmless).
- Release-check against the published tag: pending publication.

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
