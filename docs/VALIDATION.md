# Validation evidence

Date: 9 November 2026. Local environment: Linux, Node v24.22.1.

- Supplied prototype: **9 tests passed** before edits.
- First added regression suite: **18 tests, 8 passed / 10 failed** against the prototype. Failures reproduced links, path checks and baseline defects; then fixed.
- Current local suite: **50 passed, 0 failed, 0 skipped**. See [recorded output](evidence/local-tests.txt).
- `npm run verify`: passed unit/regression/CLI suite and valid, broken, and baseline exit contracts.
- `npm pack --dry-run`: passed. Packed tarball extracted in a fresh directory and its CLI scanned the valid fixture successfully. No npm registry publication performed; `private: true` intentionally prevents accidental publication.
- Public corpus: ten skills scanned; no errors, five uncertain cwd warnings. See [research](RESEARCH_LOG.md).
- Independent users, live agent experiments, and human code review: **not completed**.
- First hosted 49-test matrix: [Actions run 42578477378](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42578477378). Final 50-test release matrix is linked from the GitHub release; verify the tested commit there.
- A fresh public clone independently ran the original 49-test release-candidate suite successfully in this same environment. This is a clean-checkout check, not an independent user trial.

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
