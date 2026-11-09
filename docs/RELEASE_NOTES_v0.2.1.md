# SkillPath Guard v0.2.1 (experimental)

Changes since `V0.2.0` (commit a3ecd1b).

## Use it in CI

This is the first release with the GitHub Action:

```yaml
- uses: actions/checkout@v4
- uses: ClarrieO5/skillpath-guard@v0.2.1
  with:
    path: skills   # folder containing your SKILL.md files
```

`@V0.2.0` does not work with `uses:`, because that tag predates `action.yml`.

## Changes
- **New:** composite GitHub Action (`action.yml`) with `path`, `baseline` and `strict` inputs.
- **New:** a dangling symlink directly inside a `skills/` folder is reported as `SYMLINK_BROKEN`. microsoft/skills ships a plugin whose 10 skill links point to deleted folders; earlier versions reported nothing.
- **Fewer false positives**, measured on 33 public skill repositories (3,375 skills). `MISSING_REFERENCE` fell from 514 to 439, and all 75 removed findings were reviewed by hand; none was a real missing file. The cases now handled:
  - a file in another skill that is named on the same or previous line ("Route to `eas-app-stores`; its `references/native-ios.md`");
  - paths cut short by a placeholder (`scripts/train_<variant>_example.py`);
  - extensionless prose outside code ("repository scripts/CI commands");
  - extensionless names that match exactly one file (`./assets/card-builder` → `card-builder.ts`);
  - placeholder link targets (`[text](url)`) and command output paths (`-o assets/x.svg`, `> file`).
- **Clearer message:** `NAME_INVALID` for a skill at the scan root explains that its folder name comes from where it was cloned.
- **CI:** tests now check that the Action fails on a broken skill, and a release workflow runs `uses: ClarrieO5/skillpath-guard@v0.2.1` against the published tag.
- **Docs:** beginner quick start, contribution research and ledger, launch kit.

## Verification
- 77 tests pass locally. `npm run verify` passes: `examples/valid` exits 0, `examples/broken` exits 1, JSON output is valid, and the unchanged-baseline gate works.
- The release commit must pass all nine quality jobs (Linux, macOS, Windows × Node 20, 22, 24) before tagging. Add the run link here when publishing.
- After publishing, the `release-check` workflow must pass. Add its run link here.

## Known limits
- Not on npm; use the Action or a checkout. Frontmatter parsing is a YAML subset.
- Heuristic detection: illustrative example paths in guides, and paths into the user's own project, can still be reported (see the README "Scope and limitations").
- `AMBIGUOUS_CWD` is unvalidated against real agent runtimes beyond one Claude Code trial.
- No independent human review and no confirmed external users yet (see `docs/IMPACT_LOG.md`).
