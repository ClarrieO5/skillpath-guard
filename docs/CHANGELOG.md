# Changelog

## 0.2.2 — experimental (unreleased; prepared 2026-11-10, see RELEASE_NOTES_v0.2.2.md)

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
