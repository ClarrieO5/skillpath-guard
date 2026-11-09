# DRAFT — not filed. For the owner's review only.

Target: https://github.com/wshobson/agents/issues/new?template=bug_report.yml
Title: `[BUG] ml-pipeline-workflow lists 7 reference/asset files that do not exist`

Verified against `wshobson/agents` commit 9c61ab2 (2026-11-08), 2026-11-09. Searched issues and PRs for `ml-pipeline-workflow`, missing references and assets: nothing open. Closest precedent: closed issue #447 (same symptom in `debugging-strategies`).

---

**Preliminary checks:** tick the boxes honestly after reading the repo's guidelines.

**Affected plugin / agent / skill / command:** `plugins/machine-learning-ops/skills/ml-pipeline-workflow`

**Bug description**

`SKILL.md` (lines 57-72) says the skill has a `references/` directory (`data-preparation.md`, `model-training.md`, `model-validation.md`, `model-deployment.md`) and an `assets/` directory (`pipeline-dag.yaml.template`, `training-config.yaml`, `validation-checklist.md`). Lines 90, 190, 207 and 215 also say "See assets/pipeline-dag.yaml.template", "See references/data-preparation.md" and "See references/model-training.md". The skill folder contains only `SKILL.md`, and none of those seven file names exists anywhere in the repository.

**Steps to reproduce**

```
find plugins/machine-learning-ops/skills/ml-pipeline-workflow -type f
# -> .../SKILL.md   (only file)
git ls-files | grep -E 'pipeline-dag|data-preparation|model-training|model-validation|model-deployment|training-config|validation-checklist'
# -> no results
```

**Expected behavior**

Either the referenced files ship with the skill, or `SKILL.md` does not point at them.

**Actual behavior**

An agent that follows "See references/data-preparation.md" cannot find it.

**Additional context**

Found with SkillPath Guard (`node src/cli.mjs scan plugins/machine-learning-ops/skills/ml-pipeline-workflow`). I did not write replacement content, since the intended guidance is yours to decide. Happy to send a PR that removes the dead pointers if you prefer that to adding the files.

---
Note for owner: confirm the issue form's required fields (Harness, Harness version) yourself; I did not guess them.
