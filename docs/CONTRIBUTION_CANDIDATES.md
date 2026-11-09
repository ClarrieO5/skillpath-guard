# Contribution candidates (nothing has been filed or sent)

Each entry was checked against a shallow clone made 2026-11-09 (commit shown). Reproduce with `node src/cli.mjs scan <clone> --format json` using SkillPath Guard `main` at or after v0.2.0. "Confidence" is my judgement of whether the finding is a real problem for the maintainer, not a measured rate. Please review before anything is filed; maintainers may have intended designs (e.g. repo-wide shared folders).

| # | Project (commit) | Finding | Confidence |
|---|---|---|---|
| 1 | shanraisshan/claude-code-best-practice (1a045f7) | `.claude/skills/agent-browser/SKILL.md:198-202` links to `references/*.md` and `templates/*.sh`; the skill folder contains only `SKILL.md`. Broken links. | High |
| 2 | anthropics/skills (2c5958e) | `skills/claude-api/SKILL.md` description is about 1,068 characters by our parser (limit 1,024 in the spec and `skills-ref`). Verify with `skills-ref` before reporting. | Medium-high |
| 3 | nexu-io/open-design (checked 2026-11-09) | `html-ppt-*` skills reference `assets/runtime.js`, `assets/fonts.css`, `assets/deck-stage.js` but the skill folders hold only `SKILL.md` and `example.html`; copies exist elsewhere in the repo. May be resolved by their app. | Medium: needs maintainer input |
| 4 | coreyhaines31/marketingskills (96798cf) | `skills/link-building/SKILL.md:141-142` links `../../tools/integrations/*.md`; files exist at repo root but a skill installed alone loses them. | Medium (design choice) |
| 5 | Yuan1z0825/nature-skills (b6ae2ca) | Several skills link `../nature-shared/...`; same individual-install concern. | Medium (design choice) |
| 6 | obra/superpowers (22f0b46) | `skills/executing-plans/SKILL.md:245`, `skills/writing-skills/SKILL.md:12` use `../sibling-skill/...` links. | Medium (design choice) |
| 7 | Imbad0202/academic-research-skills (6d93886) | Sub-skill SKILL.md files cite `scripts/*.py` that exist only at the repo-root `scripts/`; relative to the skill folder they are missing. | Medium |
| 8 | career-ops-hq/career-ops (e83160c) | Seven or more `SKILL.md` files are symlinks into `.agents/skills/...`; symlinks need extra setup on Windows and are not read by our scan. | Low-medium; our tool limitation too |
| 9 | affaan-m/ECC | `.kiro/skills/react-patterns/SKILL.md:55,270` link `../../rules/...` and sibling skills; many mirrored skill trees multiply findings. | Medium |
| 10 | ComposioHQ/awesome-claude-skills | `skill-creator/SKILL.md` mentions `references/`, `assets/` layout examples; mostly illustrative (likely noise, not a bug). | Low: useful as a false-positive test case |

Rejected after checking (our false positives, now fixed): K-Dense-AI `bulk-rnaseq` (prose cites another skill's script), `generate-image` (`-o assets/logo.svg` output path), `[text](url)` placeholders in anthropics/skills `academy-guide` and K-Dense `exa-search`.

Suggested contribution form (for your approval): for #1 and #7, a PR fixing the links or a short issue with the exact lines; for design-choice items, an issue asking whether standalone installation is supported rather than asserting a bug.

Update: see `EXTERNAL_CONTRIBUTIONS.md` for the re-check. Entry 7 (academic-research-skills) was rejected as a design choice; a stronger candidate found since is Yuan1z0825/nature-skills (`name: researchwrite` vs folder `nature-proposal-writer`).
