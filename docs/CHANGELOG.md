# Changelog

## 0.2.0 — experimental (unreleased; see RELEASE_NOTES_v0.2.0.md)

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
