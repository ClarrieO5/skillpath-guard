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

- Local suite: 88 passed (87 + the annotation regression test), `npm run verify` passes (Node 22.23). Hosted matrix on `main` at a44b885 (PR #15 merged): [run 42789258700](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42789258700), green.
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
- **Defect found by the hosted run, fixed in this PR:** annotation messages contained a literal `%3A` (`Referenced file does not exist%3A references/missing.md`) because `githubAnnotations` percent-escaped `:` and `,` in the message as well as in properties. Message text now escapes only `%`, CR and LF; properties (`file`, `title`) still escape `:` and `,`. Regression test: `annotation message keeps : and , readable while properties stay escaped` (fails before the fix, passes after). The consumer runs above used the unfixed `@main`, so the hosted annotations in runs 1-5 still show the old escaping; the fix has not been exercised on a hosted consumer run yet.
- **Job-summary content: NOT verified.** Fetching the rendered run and job pages (server-rendered HTML, public repo) returned the annotations but the summary panel only said "There was an error while loading", and logs need sign-in. No rendered summary text could be read, so neither that the report appears with `summary: 'true'` nor that it is absent with `'false'` is confirmed on GitHub. Evidence that exists: local simulation only (234-706 bytes vs 0). A human look at the Summary tab of the `summary-on` / `summary-off` jobs in run 5 remains the check.
- Node.js 20 deprecation warning appears for `actions/checkout@v4` in the consumer runs (harmless).
- Release-check against the published tag: pending publication.

## v0.3.1 incident and v0.3.2 (2026-11-10)

- **Incident:** release `v0.3.1` (pre-release, published 10:10:53 UTC) was created from `main` at 4053f81 five minutes before PR #18 merged (10:15:46, `main` = ab62d5e). The tag's `package.json` says 0.3.0. Its `release-check` ([run 42796944637](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42796944637)) passed anyway: it was still pinned to `@v0.3.0` and compared nothing with the new tag. npm has no `skillpath-guard` version (registry 404 for the package, 0.3.0 and 0.3.1). Decision: published tags are not moved; `v0.3.1` is preserved and superseded by 0.3.2.
- **Fix:** version 0.3.2; `quality` and `release-check` now fail when the tag differs from `package.json`; a unit test (`release version agrees across ...`) fails when package, CLI, JSON report, workflow pins, README, changelog or release notes disagree (checked by mutating the README: the test failed; restored: passes).
- Local: 90 tests pass; hosted CI, packaging and clean-install results for the release PR are recorded below once the PR checks finish.

## v0.3.1 (prepared 2026-11-10, not released, not published to npm)

- Local: 89 tests pass, `npm run verify` passes (Node 22.23, npm 10.9.9). `npm publish --dry-run`: 8 files, 19.3 kB, "tag latest and public access", `prepublishOnly` ran.
- Clean install (empty project, empty HOME): `npm install <tarball>`, `--version` 0.3.1, valid fixture exit 0, broken fixture exit 1 (`MISSING_REFERENCE`), JSON `version` 0.3.1, `npm audit` 0 vulnerabilities; the packed `package.json` has no `private`, no dependencies, `publishConfig.access: public`.
- npm authentication: **none available in the session** (`npm whoami` fails, no `~/.npmrc`, no token variables), as expected. Account, 2FA and publish rights are unverified.
- Registry: `skillpath-guard` still 404 (unclaimed) at 2026-11-10 10:03 UTC.
- Provenance and trusted publishing: requirements read from the npm documentation source; not exercised. Provenance requires a GitHub Actions publish; trusted publishing requires an existing package, npm >= 11.5.1 and Node >= 22.14.
- Hosted CI on the release PR, `release-check` at the tag, and the post-publish `npx` check: pending (to be recorded by the release steps).

## After the v0.3.0 release (2026-11-10)

- Release: [v0.3.0](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.3.0), pre-release, tag at c55c6b4 (= `main`, PR #16 squash merge), published 09:46 UTC. Its body is GitHub's auto-generated notes, not `docs/RELEASE_NOTES_v0.3.0.md`.
- `release-check` against the published tag: [run 42793577019](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42793577019), success. `quality` on the tag: [run 42793577614](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42793577614), success; on `main`: [run 42792858062](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42792858062), success.
- Consumer repository at `uses: ClarrieO5/skillpath-guard@v0.3.0`: [run 42794375114](https://github.com/ClarrieO5/skillpath-guard-consumer-test/actions/runs/42794375114), all 6 jobs green (valid passes; broken fails; `allow-shared`; `exclude`; `summary-on`; `summary-off`).
- Annotation fix confirmed on the hosted run: the run page's annotations show `Referenced file does not exist: references/missing.md` with a plain colon; no `%3A` or `%2C` appears (read from the page converted to Markdown, not raw HTML).
- Job-summary **content** is still not verified (the summary panel does not load for an outside reader). Look at the `summary-on` / `summary-off` job pages while signed in.
- npm audit (no publish): name and four near variants unclaimed; tarball 8 files / 19 kB; clean install of the tarball in an empty project works (`--version` 0.3.0, valid exit 0, broken exit 1, `npm audit` 0 vulnerabilities); `npm publish --dry-run` OK once `private` is removed. Not verifiable: npm account, 2FA, publish rights.
- Marketplace: name uniqueness and Developer Agreement not verifiable from the session; see `docs/MARKETPLACE.md`.

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

## v0.3.3 release verification (2026-11-10)

- Tag `v0.3.3` and `main` both resolve to `67e456c6c1002238634192d2af00174244ef1574` (`git ls-remote`, run by the maintainer). Release is a pre-release.
- `release-check` on the release: [run 42898781863](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42898781863), success. `quality` on the tag push: [run 42898780384](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42898780384), success.
- Maintainer's clone of the tag on macOS: `npm run verify` passed (97 tests, 96 pass, 1 skipped: the case-insensitive-filesystem collision test, expected on macOS); `npm pack --dry-run` listed the 8 expected files; `npm publish` printed `+ skillpath-guard@0.3.3`.
- Registry: `npm view skillpath-guard versions` lists `0.0.0-stage`, `0.3.2`, `0.3.3`; `dist-tags.latest` = 0.3.3; `dist.shasum` 351d20144c038e5f0f842ee73b751d13eeb6951a equals the `npm pack` shasum shown before publishing. The `0.0.0-stage` entry was not created in these sessions and its origin is unverified.
- Immediately after publishing, `npx skillpath-guard@0.3.3` returned ETARGET; it worked with `--prefer-online` a few minutes later (registry/cache delay).
- Clean-directory check from a separate machine (the session container): `npx --yes --prefer-online skillpath-guard@0.3.3 --version` printed `0.3.3`, and scanning a skill with `description: "oops` exits 1 with `FRONTMATTER_UNSUPPORTED ... Unterminated quoted string`.
- **Not done:** consumer repository run at `@v0.3.3` (session could not attach `ClarrieO5/skillpath-guard-consumer-test`). Marketplace listing not done.

