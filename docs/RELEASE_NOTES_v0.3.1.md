> **Superseded, never released as intended.** The `v0.3.1` tag was published before PR #18 merged and points at 4053f81 (package version 0.3.0). Use v0.3.2. See `RELEASE_NOTES_v0.3.2.md`.

# SkillPath Guard v0.3.1 (experimental)

The first release published to npm. Changes since `v0.3.0` (c55c6b4): packaging only, **no scanner behaviour change**.

## Install

```sh
npx --yes skillpath-guard@0.3.1 scan path/to/your/skills
npm install --save-dev skillpath-guard   # then: npx skillpath-guard scan skills
```

GitHub Action (unchanged inputs):

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.3.1
  with:
    path: skills
```

## What changed
- `package.json`: `private: true` removed and `publishConfig.access: public` set, so the package can be published. The `v0.3.0` tag still contains `private: true`, which is why this is a new version instead of a re-publish of 0.3.0.
- A test guards package metadata: no dependencies, no install-time scripts, `files` exist, the CLI has a shebang, and the package version equals `--version`.
- README: install with `npx skillpath-guard@0.3.1` first; GitHub-tag and clone routes remain.
- Docs: npm runbook, Marketplace checklist, first-users plan.

## Migrating from v0.3.0
Nothing to change. Findings and baselines are identical to 0.3.0, the JSON `version` field reads `0.3.1`. If you pin the Action, move from `@v0.3.0` to `@v0.3.1` at your convenience. Migration notes from 0.2.2 are in `RELEASE_NOTES_v0.3.0.md`.

## Package contents (8 files, 19 kB)
`LICENSE`, `README.md`, `SECURITY.md`, `docs/CHANGELOG.md`, `package.json`, `src/cli.mjs`, `src/core.mjs`, `src/references.mjs`. No dependencies. No install scripts. No network access at run time.

## Verification
- 89 tests pass locally; `npm run verify` passes; `npm publish --dry-run` passes (Node 22.23, npm 10.9.9).
- A clean install of the packed tarball into an empty project: `--version` 0.3.1, valid fixture exit 0, broken fixture exit 1 (`MISSING_REFERENCE`), `npm audit` 0 vulnerabilities.
- Hosted CI on the release PR and on the tag, `release-check` on the tag, and the npm install check after publishing: *filled in by the maintainer's release steps (see `docs/VALIDATION.md`)*.

## Known limits
Published without npm provenance (provenance needs a GitHub Actions publish; see `docs/RELEASE.md`). Still experimental: one maintainer, substantially AI-written, no confirmed external users, no independent human review. The job-summary content of the Action has not been verified by automation.
