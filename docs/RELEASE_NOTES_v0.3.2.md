# SkillPath Guard v0.3.2 (experimental)

The first release published to npm. Scanner behaviour is identical to 0.3.0 and 0.3.1; this release is packaging, version consistency and release safeguards.

## Why 0.3.2 and not 0.3.1

The GitHub release/tag `v0.3.1` was published at 10:10 UTC on 2026-11-10, **before** the release PR (#18) was merged at 10:15 UTC. The tag therefore points at 4053f81, whose `package.json` still says `0.3.0` (and has no `repository`-consistent README npm line). Its own `release-check` passed because that workflow was still pinned to `v0.3.0` and compared nothing with the new tag. A published tag is never moved, so `v0.3.1` stays as a historical pre-release; **do not use it**. Nothing was published to npm under 0.3.1.

## Install

```sh
npx --yes skillpath-guard@0.3.2 scan path/to/your/skills
npm install --save-dev skillpath-guard   # then: npx skillpath-guard scan skills
```

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.3.2
  with:
    path: skills
```

## What changed
- Version 0.3.2 everywhere (`package.json`, `--version`, JSON report, workflow pins, README).
- New guards: `quality` fails on a tag push if the tag differs from `package.json`; `release-check` fails a published release whose tag differs from `package.json`; a unit test fails if package, CLI, JSON report, workflow pins, README, changelog and release notes disagree.
- `docs/RELEASE.md`: release order (merge first, then create the tag on the merged commit) and a tag-equals-main check before publishing to npm.
- Everything from `v0.3.1`'s PR: `private` removed, `publishConfig.access: public`, package metadata test, README `npx skillpath-guard`.

## Migrating
From 0.3.0 or 0.3.1: nothing. Findings, baselines and exit codes are unchanged; the JSON `version` reads `0.3.2`. Pin `@v0.3.2` instead of `@v0.3.1`.

## Package contents (8 files, about 19 kB)
`LICENSE`, `README.md`, `SECURITY.md`, `docs/CHANGELOG.md`, `package.json`, `src/cli.mjs`, `src/core.mjs`, `src/references.mjs`. No dependencies, no install scripts, no network access at run time.

## Verification
Recorded in `docs/VALIDATION.md` (local suite, clean install, hosted CI on the release PR, tag-equals-main check, `release-check`, npm install check).

## Known limits
Published without npm provenance (needs a GitHub Actions publish; see `docs/RELEASE.md`). Experimental: one maintainer, substantially AI-written, no confirmed external users, no independent human review. Job-summary content of the Action not verified by automation. Not tested on Node 26 in CI (CI covers 20, 22, 24).
