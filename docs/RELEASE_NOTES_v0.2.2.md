# SkillPath Guard v0.2.2 (experimental)

Changes since `v0.2.1` (commit f1802cd). A bug-fix release: three false positives found by re-scanning 20 public skill repositories.

## Use it in CI

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.2.2
  with:
    path: skills   # folder containing your SKILL.md files
```

## Fixes
- **Footnotes:** GFM footnote definitions (`[^1]: GitHub Blog. (2022)...`) were read as link reference definitions. The first word was reported as a missing file, and real paths written inside the footnote were skipped.
- **Line-number suffixes:** `scripts/helper.py:42`, `scripts/x.py:3-9` and Docker `./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql` are now checked as `scripts/helper.py`, `scripts/x.py` and `scripts/init.sql`. Before, a file that existed but was cited with a line number was reported missing.
- **Web routes:** root-relative routes in links (`[analytics](/features/analytics)`, `[home](/)`) are no longer `ABSOLUTE_REFERENCE` errors. Targets that look like filesystem paths are still errors: a known OS root (`/Users`, `/home`, `/tmp`, `/workspaces`...), a `references`/`scripts`/`assets` segment, or a file extension.

Measured on 20 public repositories (3,165 skills, including mirrored copies): 3 false positives removed and 15 targets corrected; no other finding changed (`docs/CORPUS_VALIDATION.md`, round 3). Each fix has a regression test that failed before the fix.

If you use `--baseline` with `--fail-on-new`: findings whose target changed (for example `scripts/helper.py:42` becoming `scripts/helper.py`) appear once as resolved and, if still missing, as new. Regenerate the baseline after upgrading.

## Verification
- 80 tests pass locally; `npm run verify` passes.
- CI on the release commit and `release-check` against the tag: to be filled in after the release (see `docs/RELEASE.md`).

## Known limits
Unchanged from v0.2.1: not on npm; YAML-subset frontmatter; heuristic detection (illustrative example paths, repo-root scripts and files a skill tells the agent to create can still be reported); `AMBIGUOUS_CWD` is not precision-checked; no independent human review or confirmed external users yet.
