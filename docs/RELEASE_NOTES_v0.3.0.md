# SkillPath Guard v0.3.0 (experimental)

Changes since `v0.2.2` (cc739d3). Source: the adoption audit, PR #15 (`docs/ADOPTION_AUDIT_2026-11.md`). **This release contains one behaviour change; read "Migrating from v0.2.2".**

## Use it in CI

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.3.0
  with:
    path: skills
    # allow-shared: 'true'   # repo is installed as one bundle; ../shared links are warnings
    # exclude: |             # one path per line, relative to `path`
    #   vendored
    # summary: 'true'        # full Markdown report in the job summary (default)
```

## What changed
- **Behaviour change:** `AMBIGUOUS_CWD` is off by default. Opt in with `--cwd-hints` / Action `cwd-hints: 'true'`. The Agent Skills specification recommends the skill-relative links it warned about; in a seeded sample of 30 of its 594 warnings in 12 public repositories, none showed a defect. `--strict` no longer fails spec-conforming skills.
- **New `--allow-shared` / `allow-shared`** (off by default): a link that leaves the skill folder but whose target exists inside the scanned repository is a `SHARED_REFERENCE` warning, not a `PATH_ESCAPE` error. Missing targets, targets outside the repository and escaping symlinks stay errors. Without the flag, `PATH_ESCAPE` now says when the file exists and names the flag.
- **Line-level ignores:** `<!-- skillpath-guard-ignore -->` on a line, or `<!-- skillpath-guard-ignore-next-line -->` on the line above. Counted in `summary.suppressed`.
- **Action:** new inputs `exclude`, `allow-shared`, `cwd-hints`, `summary`; the full report goes to the job summary (cap 500 rows); `--markdown-summary <file>` on the CLI; Marketplace `branding`.
- **Package:** 8 files / 48 kB instead of 38 / 182 kB; metadata and `prepublishOnly`. Still `private: true`; not published to npm.

## Migrating from v0.2.2
1. **Baselines:** regenerate them. `AMBIGUOUS_CWD` findings show as resolved, and `PATH_ESCAPE` findings whose target exists have a new message (a new identity), so `--fail-on-new` would otherwise report them as new. `node src/cli.mjs scan <dir> --format json --out baseline.json`.
2. **Exit codes** without `--strict` are unchanged. With `--strict`, fewer runs fail (no `AMBIGUOUS_CWD`).
3. **If you relied on `AMBIGUOUS_CWD`:** add `--cwd-hints` / `cwd-hints: 'true'`.
4. **Bundle repositories** that failed on `../shared/...` links: add `allow-shared: 'true'` (opt-in; the default is unchanged).
5. **JSON consumers:** reports gain `options` (`cwdHints`, `allowShared`) and `summary.suppressed`.
6. Pin `@v0.3.0` (or a SHA). `exclude`, `allow-shared`, `cwd-hints` and `summary` do not exist in `v0.2.2`.

## Verification
- 87 tests pass locally; `npm run verify` passes (Node 22.23). Hosted matrix on `main` at a44b885 (PR #15 merged): [run 42789258700](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42789258700), green.
- 12-repository first-run benchmark (`docs/ADOPTION_AUDIT_2026-11.md`): 594 warnings removed, nothing else changed; with `--allow-shared` 196 errors become warnings and repositories failing drop from 9 to 7.
- Consumer-repository test of the Action: **local simulation only** (the Action's shell step run against a copy of the test kit in a separate directory: valid exit 0, broken exit 1 with `MISSING_REFERENCE`, shared link `PATH_ESCAPE` exit 1 then `SHARED_REFERENCE` exit 0 with `allow-shared`, `exclude` with whitespace trimmed, `summary: false` writes 0 bytes). **No hosted run from a separate repository has happened yet**; kit: `docs/external-action-test/`. Run links: *to be added after the maintainer runs it*.
- Release-check run against the published tag: *pending publication*.

## Known limits
Unchanged from v0.2.2 plus: not on npm; the Action has not been run from a separate repository; `--allow-shared` and the new `SHARED_REFERENCE` rule have only been measured on 12 repositories; no independent human review or confirmed external users yet.
