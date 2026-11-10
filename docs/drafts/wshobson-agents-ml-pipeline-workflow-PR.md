<!-- Draft for wshobson/agents. NOT submitted. Prepared 2026-11-10 against upstream main 9c61ab2 (unchanged since the patch was made).
Patch: docs/patches/wshobson-agents-ml-pipeline-workflow.patch (`git apply --check` passes on 9c61ab2).
Uses the repo's .github/PULL_REQUEST_TEMPLATE.md headings. Copy everything below the TITLE/BODY markers.

What was checked in the 2026-11-10 session (scratch clone of 9c61ab2 with the patch applied):
- All 5 changed JSON files parse (python -m json.tool), as their code-quality workflow does.
- markdownlint-cli2 0.18.1 with their .markdownlint.json: 0 errors before and after.
- SkillPath Guard on plugins/machine-learning-ops: 4 errors before, 0 after. skills-ref 0.1.1: valid before and after.
- By reading their tools (not running them): check_version_bumps.py needs a higher version in
  plugins/<name>/.claude-plugin/plugin.json -> done (1.2.3 -> 1.2.4); doc_gardener.py requires marketplace.json
  entries to match plugin.json -> both marketplaces bumped; test_static_score_snapshot.py skips skills whose
  content changed (compare_snapshot counts them as stale; the test only fails below 50% matched).
  The bump touches the same 5 files the maintainer's own bump commit (#799) touches per plugin.
- NOT run: make validate STRICT=1, make garden, make test, make smoke-test, ruff/ty. Running third-party
  code was blocked by this environment's permission system. Run them locally before submitting, or leave
  those boxes unticked and let CI run them. -->

TITLE:
fix(machine-learning-ops): remove pointers to missing files in ml-pipeline-workflow

BODY:
## Summary

- `ml-pipeline-workflow/SKILL.md` tells agents to read `references/{data-preparation,model-training,model-validation,model-deployment}.md` and `assets/{pipeline-dag.yaml.template,training-config.yaml,validation-checklist.md}`, but the skill has no `references/` or `assets/` folder. An agent that follows the instructions tries to open seven files that don't exist.
- This PR removes the "Reference Documentation" and "Assets and Templates" sections and four inline `# See ...` comments. Nothing else in the skill changes.
- Bumps `machine-learning-ops` 1.2.3 → 1.2.4 in both `plugin.json` files and both marketplaces, so installed copies update (per #786/#799).

## Scope

- [x] Plugin authoring (new or modified `plugins/<name>/...`)

## Affected harnesses

- [x] Claude Code
- [x] OpenAI Codex CLI
- [x] Cursor
- [x] OpenCode
- [x] Antigravity CLI
- [x] Pi

(Content-only change to one SKILL.md; every harness that ships the skill gets the same text.)

## Test plan

- [ ] `make validate STRICT=1`
- [ ] `make garden`
- [ ] `make test` (full pytest suite)
- [ ] `make smoke-test` (real-CLI subprocess tests)
- [ ] Ran ruff + ty in `plugins/plugin-eval/`
- [x] Other checks run locally: all changed JSON files parse; markdownlint (repo config) reports 0 errors on the edited SKILL.md; SkillPath Guard reports 4 missing-file errors before (3 distinct files, from the inline comments) and 0 after. The other files appear only as bare names in the removed lists, which it does not resolve; I checked those by hand.

## Cross-harness portability notes

- The skill body gets shorter (6.3 KB after the change), so it stays under Codex's 8 KB cap.

## Related issue(s)

Same kind of fix as #447 (`debugging-strategies`), which was resolved by shipping the missing files. If you'd rather add the referenced files here too, I'm happy to close this.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard), an offline checker for skill file references, and prepared with an AI coding assistant (Claude Code). I reviewed the diff before submitting.
