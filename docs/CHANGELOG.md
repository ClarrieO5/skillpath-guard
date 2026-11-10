# Changelog

## Unreleased

- Frontmatter: an unterminated quoted value (`description: "oops`) is now reported as `FRONTMATTER_UNSUPPORTED`; multi-line quoted values are read instead of truncated.
- `NAME_INVALID`, `DESCRIPTION_INVALID`, `COMPATIBILITY_INVALID` messages now name the actual value or length and which check failed. These three rules no longer include the message in baseline identity, so v0.3.2 baselines keep working.
- Action: boolean inputs are case-insensitive; invalid values fail with a clear error (previously ignored silently).
- README restructured for new users; new docs: real-world validation, measured comparison, Marketplace readiness, release readiness.

## 0.3.2 — experimental (prepared 2026-11-10; tag `v0.3.2` after approval, see RELEASE_NOTES_v0.3.2.md)

- First release meant for npm as `skillpath-guard` (after the maintainer's approval). No scanner behaviour change.
- Release safeguards: `quality` fails when a pushed `v*` tag differs from `package.json`; `release-check` fails a published release whose tag differs from `package.json`; a test checks that package, CLI, JSON report, workflow pins, README, changelog and release notes agree.
- Replaces 0.3.1, whose GitHub tag was created before the release PR merged and points at a commit with version 0.3.0. `v0.3.1` is left in place and must not be used; nothing was published to npm under that number.

## 0.3.1 — not usable (tag `v0.3.1` points at 4053f81, package version 0.3.0)

- Package: `private: true` removed and `publishConfig.access: public` added so the package can be published once the maintainer decides; a test guards package metadata (no dependencies, no install-time scripts, version equals `--version`). Nothing is published to npm. See `docs/RELEASE.md`, "npm publication".

## 0.3.0 — experimental (prepared 2026-11-10; tag `v0.3.0` after approval, see RELEASE_NOTES_v0.3.0.md and ADOPTION_AUDIT_2026-11.md)

- **Behaviour change:** `AMBIGUOUS_CWD` is off by default; `--cwd-hints` (Action: `cwd-hints: 'true'`) turns it on. The Agent Skills specification recommends exactly the skill-relative links it warned about, and a seeded sample of 30 of its 594 warnings in 12 public repositories found none that showed a defect. `--strict` no longer fails spec-conforming skills. Exit codes without `--strict` are unchanged. Baselines made with v0.2.2 will show those warnings as resolved.
- Fix: GitHub annotation message text no longer escapes `:` and `,` (a literal `%3A` showed in the annotation); property values still do.
- New: `--allow-shared` (Action: `allow-shared`). A link that leaves the skill folder but whose target exists inside the scanned repository is a `SHARED_REFERENCE` warning instead of a `PATH_ESCAPE` error, for repositories installed as one bundle. Missing targets and targets outside the repository stay errors. Off by default.
- New: `<!-- skillpath-guard-ignore -->` on a line, or `<!-- skillpath-guard-ignore-next-line -->` on the line above, silences line-level findings there; `summary.suppressed` counts them.
- New: `--markdown-summary <file>` appends the Markdown report (capped at 500 rows); the Action writes it to the job summary by default (`summary` input). New Action inputs `exclude` (one path per line), `allow-shared`, `cwd-hints`, `summary`, and Marketplace `branding`.
- `PATH_ESCAPE` messages say when the target exists in the repository and point to `--allow-shared` (this changes the finding's identity: regenerate baselines).
- JSON reports include `options` (`cwdHints`, `allowShared`).
- Package: the npm tarball ships only `src/`, README, LICENSE, SECURITY and the changelog (8 files, 48 kB, was 38 files, 182 kB, including drafts and patches for other projects). Added keywords, homepage, bugs and a `prepublishOnly` verify. Still `private: true`.
- README: `npx --yes github:ClarrieO5/skillpath-guard#v0.3.0` works from a clean machine without npm publication.

## 0.2.2 — experimental (2026-11-10; tag `v0.2.2`, see RELEASE_NOTES_v0.2.2.md)

- Fix: GFM footnote definitions (`[^1]: GitHub Blog. (2022)...`) were read as link reference definitions, which reported the first word (`GitHub`) as a missing file and hid real paths written inside the footnote.
- Fix: a location suffix on a bare path is no longer part of the file name. `scripts/helper.py:42`, `scripts/x.py:3-9` and Docker `./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql` are now checked as `scripts/helper.py`, `scripts/x.py` and `scripts/init.sql`. Before this fix, a file that existed but was cited with a line number was reported missing.
- Fix: root-relative web routes in links (`[analytics](/features/analytics)`, `[home](/)`) are no longer `ABSOLUTE_REFERENCE` errors. Targets that look like filesystem paths are still errors: a known OS root (`/Users`, `/home`, `/tmp`, `/workspaces`...), a `references`/`scripts`/`assets` segment, or a file extension.
- Measured on 20 public repositories (3,165 skills, including mirrored copies): 3 false positives removed and 15 targets corrected; no other finding changed (see `docs/CORPUS_VALIDATION.md`, round 3).
- Docs: project status handoff (`docs/STATUS.md`), v0.2.1 CI evidence, contribution ledger re-verified and corrected.

## 0.2.1 — experimental (2026-11-10; tag `v0.2.1`, see RELEASE_NOTES_v0.2.1.md)

- First release that includes the composite GitHub Action: `uses: ClarrieO5/skillpath-guard@v0.2.1`. CI now also checks that the action fails on a broken skill, and a release workflow runs the exact consumer line against the published tag.

- Placeholder link targets (`[text](url)`) and command output paths (`-o assets/x.svg`, `--output`, `>`) are no longer reported as missing files (found by sampling real skills).
- Added `action.yml` composite GitHub Action (smoke-tested in CI) and a beginner quick start in the README.
- New: a dangling symlink directly inside a `skills/` folder is reported as `SYMLINK_BROKEN` (found in microsoft/skills, where a plugin's 10 skill links pointed to deleted folders).
- Fewer false positives, measured on 33 public repositories (514 -> 439 `MISSING_REFERENCE`, all 75 removals reviewed): files in another skill named on the same or previous line; paths cut short by a `<placeholder>` or `{placeholder}`; extensionless prose pairs outside code ("scripts/CI commands"); extensionless names that match exactly one file.
- README: CI and install instructions use `v0.2.1`; `@V0.2.0` predates `action.yml` and does not work.
- `NAME_INVALID` for a skill at the scan root now explains that the folder name comes from the checkout location (e.g. a clone named `owner__repo`); still an error, since the spec requires name = folder.
- Docs: tag is `V0.2.0` (capital V); added `docs/CONTRIBUTION_CANDIDATES.md` and an expanded `CONTRIBUTING.md`.

## 0.2.0 — experimental (2026-11-09; published as tag `V0.2.0`, capital V; see RELEASE_NOTES_v0.2.0.md)

- Added `COMPATIBILITY_INVALID` (over 500 characters). Version bumped to 0.2.0.
- Bare folder mentions followed by punctuation are no longer reported as missing.

- Performance: per-skill file indexing removes an O(skills x files) scan; a 562-skill repo drops from 8.9 s to 0.56 s.
- Skill names now follow the reference validator: Unicode lowercase letters/digits and single hyphens (NFKC); uppercase and double hyphens remain errors.
- Corrected `docs/CORPUS_VALIDATION.md` (omitted 9,013-skill repository; misattributed +4 change). Added `docs/COMPARISON.md` and `docs/RUNTIME_EVIDENCE.md`.

- Bare folder mentions (`scripts/`, `references/`) in prose are no longer reported as missing files.
- Link-like syntax inside inline code and non-Markdown fenced blocks is no longer parsed as a Markdown link (e.g. Go generics).
- Added `docs/CORPUS_VALIDATION.md` (23 public repositories, ranked findings).

- Dangling `SKILL.md` symlinks now report `SYMLINK_BROKEN` instead of throwing.
- Windows drive paths in Markdown links (`[g](C:\Users\x.md)`) are flagged `ABSOLUTE_REFERENCE`; backslashes now escape only ASCII punctuation, as in CommonMark.
- Content inside ```` ```markdown ````/```` ```md ```` fences is skipped to avoid false positives; other fences (shell, etc.) are still checked.

## 0.1.0 — experimental prerelease — 9 November 2026

Built from the supplied 0.1.0 prototype, with no claim of a prior public release.

- Fixed local-link coverage for spaces, parentheses, titles, reference definitions, query strings, and paths outside the conventional resource folders.
- Avoided extracting phantom local resources from external URLs and dynamic globs.
- Added absolute-reference diagnostics and prevented reading out-of-package symlinked SKILL.md content.
- Checked case across every path segment, even on case-insensitive filesystems.
- Fixed baseline identity across same-named skills; rejected malformed baseline data.
- Kept JSON stdout valid when emitting Actions annotations; corrected annotation paths to the current working directory.
- Added CLI exit-policy tests, metadata regressions, public-corpus audit, contribution templates, and release guidance.

Limits: no runtime execution, no full YAML/CommonMark compliance, no established external adoption. See README and validation evidence before relying on the release.
