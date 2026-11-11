<!-- Draft for Orchestra-Research/AI-Research-SKILLs. NOT submitted. Prepared 2026-11-11 against main 773a529 (last commit 2026-06-15).
Recommendation: ISSUE, not PR. The last merges were 2026-06-16; since then 15 PRs, including #81 (the same kind of fix for verl), have had no maintainer response.
Alternative, lower-noise option: a single comment on existing issue #80 listing these links, instead of a new issue.
Duplicate search 2026-11-11: only #80/#81 (verl multi-turn.md, excluded below); searched each skill name and file name, open and closed. -->

TITLE:
17 "See references/..." links point to files that are not in the skill (mamba, constitutional-ai, llamaguard, nemo-guardrails, ray-train, flash-attention, speculative-decoding)

BODY:
Like #80 (verl), several skills end with "Advanced topics" lines that tell the agent to read a reference file the skill does not ship. Checked on `main` at 773a529:

| Skill | Line | Missing file |
|---|---|---|
| 01-model-architecture/mamba | 229, 231, 233 | references/selective-ssm.md, mamba2-details.md, performance.md |
| 07-safety-alignment/constitutional-ai | 262, 264, 266 | references/constitution-design.md, rlaif-comparison.md, cot-critique.md |
| 07-safety-alignment/llamaguard | 305, 307, 309 | references/custom-categories.md, benchmarks.md, deployment.md |
| 07-safety-alignment/nemo-guardrails | 268, 270, 272 | references/colang-guide.md, integrations.md, performance.md |
| 08-distributed-training/ray-train | 380, 382 | references/hyperparameter-tuning.md, custom-loops.md |
| 10-optimization/flash-attention | 345, 347 | references/algorithm.md, advanced-features.md |
| 19-emerging-techniques/speculative-decoding | 463 | references/draft_model.md |

`constitutional-ai`, `llamaguard` and `nemo-guardrails` have no `references/` folder at all. I found no file elsewhere in the repo that looks like the intended target.

Either removing the "See ..." pointers (as #81 does for verl) or adding the files would fix it. I can open a PR for the first option if that would help.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard) and checked by hand; prepared with an AI coding assistant (Claude Code).
