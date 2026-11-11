# Release plan: v0.3.4 (proposed, not started)

Prepared 2026-11-11 (session 10). Nothing in this plan has been done: no version bump, no tag, no release, no npm publish.

## Is a release justified?

Yes, but only for the two scanner fixes now in the scanner-fix PR (from branch `claude/blissful-lovelace-5z8gfa`):

1. **New error (false negative fixed):** an unquoted frontmatter value containing `: ` or ending with `:` is reported as `FRONTMATTER_UNSUPPORTED`. PyYAML, js-yaml, yaml and `skills-ref` reject such frontmatter, so agents that parse it with a real YAML library may skip the skill. Found in LambdaTest/agent-skills.
2. **False positive removed:** `[LABEL]: some prose` is no longer treated as a link reference definition. Found in deanpeters/Product-Manager-Skills.

Evidence: `docs/VALIDATION.md`, "Unreleased scanner fixes: re-verification". On 25 public repositories (1,798 skills) the findings are identical before and after; on the two source repositories exactly one finding changes each.

**Version:** patch (`0.3.4`), the same reasoning as 0.3.3 (which also added a frontmatter error that only fires on YAML a strict parser rejects). No flag, exit code, JSON field or rule name changes. A repository with such a value newly fails; say so in the notes. If you treat a newly failing CI gate as breaking, use 0.4.0 instead.

**Do not release** if the scanner-fix PR is not merged, or if its hosted `quality` run is not green on all 9 jobs.

## Order (each step needs your go-ahead)

1. **Merge the scanner-fix PR** (docs + 2 fixes + 2 regression tests). This does not change the version.
2. **Release PR (a session can prepare it after you say "prepare v0.3.4"):** bump `0.3.3` → `0.3.4` in `package.json`, `src/cli.mjs` (usage line and `--version`), `src/core.mjs` (report `version`), `tests/cli.test.mjs`, `.github/workflows/release-check.yml` (both `uses:` pins, the clone `--branch` and the version test), and the README pins (lines 7, 18, 24, 37, 51, 73). Add `docs/RELEASE_NOTES_v0.3.4.md` and move the CHANGELOG "Unreleased" entries under `0.3.4`. `npm test` fails if the version strings disagree. Wait for all 9 `quality` jobs.
3. **Merge the release PR only when you can publish within the hour** (the README in the tarball shows the npm install line).
4. `git fetch origin main` and note the merge SHA.
5. GitHub → Releases → **Draft a new release**: tag `v0.3.4` (lowercase `v`, new tag), target `main`, confirm the SHA, tick **Set as a pre-release**, paste `docs/RELEASE_NOTES_v0.3.4.md`, publish.
6. Check `release-check` (on release publish) and the tag-push `quality` run are green. If `release-check` fails, edit the release back to draft and fix forward. **Never move or delete a published tag** (`v0.3.1` and `V0.2.0` stay as they are).
7. `git ls-remote --tags origin v0.3.4` must show the same SHA as `main`.
8. npm (manual, from a clean clone of the tag): `git clone --depth 1 --branch v0.3.4 https://github.com/ClarrieO5/skillpath-guard.git`, `cd skillpath-guard`, check `node -p "require('./package.json').version"` prints `0.3.4`, `npm run verify`, `npm pack --dry-run` (8 files), `npm login`, `npm publish`.
9. Check: `npx --yes --prefer-online skillpath-guard@0.3.4 --version` prints `0.3.4` in an empty directory (allow a few minutes for registry delay; 0.3.3 returned ETARGET at first).
10. Record run links, SHA and npm shasum in `docs/VALIDATION.md` and `docs/STATUS.md` in a docs-only PR.

## Rollback

- Before the tag: close the release PR; nothing is published.
- Tag published but npm not: leave the tag, fix forward in 0.3.5. Do not reuse or move `v0.3.4`.
- npm published with a defect: `npm deprecate skillpath-guard@0.3.4 "<reason>"` and release 0.3.5. Do not unpublish.

## Draft release notes (for `docs/RELEASE_NOTES_v0.3.4.md`)

> **SkillPath Guard v0.3.4 (experimental)**
>
> - **New error:** an unquoted frontmatter value that contains `: ` (colon + space) or ends with `:` is reported as `FRONTMATTER_UNSUPPORTED`. YAML reads it as a nested mapping, and PyYAML, js-yaml, yaml and `skills-ref` reject the whole frontmatter. Quote the value or use a block scalar (`description: >-`). A repository with such a value will newly fail.
> - **Fewer false positives:** `[LABEL]: some prose` is no longer read as a Markdown link reference definition (CommonMark allows only an optional title after the destination).
> - On 25 public repositories (1,798 skills) the findings are identical before and after this release.
>
> Migrating from 0.3.3: no flag, exit code, JSON field or rule name changed. Pin `@v0.3.4`.
