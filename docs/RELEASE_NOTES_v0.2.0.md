# SkillPath Guard v0.2.0 (experimental)

Draft release notes. Not yet published; tag and release require maintainer approval.

## Changes since v0.1.0
- **Fixed:** dangling `SKILL.md` symlinks produce `SYMLINK_BROKEN` instead of throwing.
- **Fixed:** Windows drive paths in Markdown links (`C:\Users\...`) are flagged `ABSOLUTE_REFERENCE`.
- **Fewer false positives:** `markdown`/`md` fenced examples are skipped; link-like syntax in code (e.g. Go generics) and bare folder mentions (`scripts/`) are no longer reported. On 21 public repositories (about 2,850 skills, excluding one very large repo) this removed 149 MISSING_REFERENCE and 32 AMBIGUOUS_CWD findings.
- **Performance:** 562-skill repo 8.9 s to 0.56 s; 9,013-skill repo about 22 s.
- **Spec alignment:** Unicode lowercase skill names accepted (as in the reference validator); `compatibility` over 500 characters is an error.
- **Docs:** corpus validation (with corrections), comparison notes, runtime evidence, adoption plan, CI usage in README.

## Known limits
- Not on npm; run from a checkout. Frontmatter parsing is a YAML subset.
- `../sibling` references are reported as PATH_ESCAPE (mostly true positives for individually installed skills); root-relative web routes in links may be flagged as absolute.
- Only the official `skills-ref` source was compared, by reading it; no identical-fixture run against two validators (installation was blocked). One Claude Code runtime trial; `AMBIGUOUS_CWD` is unvalidated.
- No external adoption evidence yet.

## Release checklist (maintainer)
1. Merge the v0.2.0 PR after CI is green.
2. `git tag v0.2.0 && git push origin v0.2.0`; create a GitHub release marked pre-release with these notes.
