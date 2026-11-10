# Real-world validation, 2026-11-10 (published v0.3.2)

**What this is.** `skillpath-guard@0.3.2`, installed from the npm registry into an empty directory, run with default settings on fresh `git clone --depth 1` checkouts of 25 public repositories that contain Agent Skills. Commit SHAs are exact. Nothing here was sent to any maintainer.

**What this is not.** It is not an accuracy rate. There is no ground truth for real repositories, so findings were read and classified by one reviewer (an AI session) against the source line. Labels below are judgements and may be wrong. The ground-truth measurement is the labelled fixture suite in [COMPARISON.md](COMPARISON.md).

Setup: Node v22.23.4, Linux container, one run per repository, wall-clock including Node start-up (so treat times as order-of-magnitude). "Skills" is the number of `SKILL.md` files found outside `.git`/`node_modules`, including nested test/eval copies. Columns: errors/warnings with defaults; findings by rule; errors when `--allow-shared` is added; skills-ref column is the number of skills `skills-ref` (0.1.1) reports at least one error for.

| Repository | Commit | Skills | Err/Warn | Findings (default) | Err with `--allow-shared` | Time | skills-ref skills with errors |
|---|---|---|---|---|---|---|---|
| [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | `2d2065fb4520fa3f3f2bcf61cff26ec8b7eba4b5` | 177 | 0/0 | none | 0 | 0.80 s | 0 |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `301b02b12bff98e4688e6984af6556802322bbde` | 25 | 0/0 | none | 0 | 0.10 s | 0 |
| [anthropics/skills](https://github.com/anthropics/skills) | `2c5958ecac7cee2b583967a2c4981d0f4a75c579` | 20 | 2/0 | DESCRIPTION_INVALID 1, NAME_INVALID 1 | 2 | 0.13 s | 2 |
| [blader/humanizer](https://github.com/blader/humanizer) | `b48c832f0f809c1b5658edbb838c2521b72f2413` | 1 | 1/0 | NAME_INVALID 1 | 1 | 0.05 s | 1 |
| [cloudflare/skills](https://github.com/cloudflare/skills) | `6eb6c781aa9b6438e0c7307bd102788a75fe1a6d` | 22 | 7/0 | PATH_ESCAPE 7 | 0 | 0.14 s | 0 |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `9d6d7ce8d18eb155dc2f9762435f097e60cdad7c` | 53 | 6/0 | PATH_ESCAPE 6 | 0 | 0.22 s | 0 |
| [dotnet/skills](https://github.com/dotnet/skills) | `96c3d68dad2855e3ab5178aa1a262789d86a1466` | 116 | 13/0 | PATH_ESCAPE 11, MISSING_REFERENCE 2 | 3 | 0.41 s | 4 |
| [expo/skills](https://github.com/expo/skills) | `a9e5bd3fa00b4e61f632e43f85da73aee1942582` | 25 | 0/0 | none | 0 | 0.12 s | 0 |
| [firebase/agent-skills](https://github.com/firebase/agent-skills) | `99954a30898bb5ddc8152ee10e124dc3b4106bf7` | 14 | 1/0 | NAME_INVALID 1 | 1 | 0.10 s | 3 |
| [getsentry/skills](https://github.com/getsentry/skills) | `e94f22214528d69899d09c627b3315ddc3544816` | 31 | 1/0 | MISSING_REFERENCE 1 | 1 | 0.11 s | 3 |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | `227949a7542a55d2155c00e7cdb998d9a0fee4f3` | 478 | 29/0 | MISSING_REFERENCE 7, CASE_MISMATCH 3, NAME_INVALID 15, PATH_ESCAPE 4 | 25 | 0.70 s | 34 |
| [googleworkspace/cli](https://github.com/googleworkspace/cli) | `cd3697e07eb520056dcf142d0c7439bbb9ba32e9` | 95 | 75/0 | PATH_ESCAPE 75 | 0 | 0.10 s | 0 |
| [huggingface/skills](https://github.com/huggingface/skills) | `25910b3d0ba31a2ba102f901cdc9e008c278a69c` | 26 | 1/0 | MISSING_REFERENCE 1 | 1 | 0.15 s | 0 |
| [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) | `3ccff5338ea700537839b21900aa5358a0402c98` | 6 | 0/0 | none | 0 | 0.06 s | 0 |
| [langchain-ai/langchain-skills](https://github.com/langchain-ai/langchain-skills) | `126c384d8552dcb476b226c244172186cc3f4328` | 22 | 0/0 | none | 0 | 0.09 s | 0 |
| [microsoft/skills](https://github.com/microsoft/skills) | `18e05b845d43e869b5701d796abce6e9a49e57db` | 211 | 100/0 | MISSING_REFERENCE 25, PATH_ESCAPE 65, SYMLINK_BROKEN 10 | 37 | 0.62 s | 3 |
| [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills) | `2b0e2b6f56d2b41c5363049e30e6ab72aa260cce` | 15 | 1/0 | DESCRIPTION_INVALID 1 | 1 | 0.13 s | 1 |
| [obra/superpowers](https://github.com/obra/superpowers) | `22f0b463e7a5e579904dd6211a520321035526f7` | 15 | 5/0 | PATH_ESCAPE 3, MISSING_REFERENCE 2 | 2 | 0.09 s | 0 |
| [openai/skills](https://github.com/openai/skills) | `49f948faa9258a0c61caceaf225e179651397431` | 44 | 37/0 | PATH_ESCAPE 23, MISSING_REFERENCE 14 | 14 | 0.18 s | 0 |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | `1af7e69a2a613437d46095924057970a6a7df40d` | 13 | 0/0 | none | 0 | 0.10 s | 13 |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | `c9be0e931b7930f7d02126d04774d904c381e7d7` | 2 | 0/0 | none | 0 | 0.07 s | 0 |
| [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) | `8658b6658c762b9e5efd3956ed35a51c41bdf6c3` | 94 | 16/0 | MISSING_REFERENCE 2, NAME_INVALID 3, PATH_ESCAPE 11 | 12 | 0.34 s | 5 |
| [trailofbits/skills](https://github.com/trailofbits/skills) | `e4dd0bb5b15535f7c5a0834187dffba6ac37e4ff` | 98 | 88/0 | PATH_ESCAPE 84, MISSING_REFERENCE 4 | 4 | 0.32 s | 23 |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | 9 | 4/0 | NAME_INVALID 4 | 4 | 0.09 s | 4 |
| [wshobson/agents](https://github.com/wshobson/agents) | `9c61ab243def98f72da12abd41cfcf5bcd91af9d` | 185 | 20/0 | PATH_ESCAPE 15, MISSING_REFERENCE 5 | 5 | 0.26 s | 14 |

Totals: 25 repositories, 1,797 `SKILL.md` files, 407 findings (all errors, 0 warnings by default), 5.5 s of scan time in total. 7 repositories exit 0 and 18 exit 1. With `--allow-shared` the 407 errors become 113.

## Classification of findings

### PATH_ESCAPE (304, in 11 repositories): real portability limit, mostly intentional
A link such as `../shared/x.md` leaves the skill folder. It works when the whole repository (plugin/bundle) is installed and breaks when one skill is installed alone. With `--allow-shared`, errors fall by 294 (407 to 113): in 294 of the 304 cases the target exists elsewhere in the repository. These were **not** re-read one by one in this round; earlier rounds (CORPUS_VALIDATION.md, ADOPTION_AUDIT) did read samples. Verdict: not bugs in the tool, and not necessarily bugs in the repository; the right default is debatable, so it stays an error unless `--allow-shared` is set. The 10 remaining escapes point at files that do not exist in the repository (not individually inspected).

### NAME_INVALID (25) and DESCRIPTION_INVALID (2), spec violations, confirmed by skills-ref
The specification requires `name` to equal the parent directory name. Examples read at the source: `vercel-labs/agent-skills` `skills/composition-patterns` declares `name: vercel-composition-patterns` (4 skills, same pattern); `firebase/agent-skills` `firebase-data-connect-basics` declares `firebase-data-connect`; `github/awesome-copilot` has 15 `qdrant-*` skills whose names are prefixed with the parent folder (`qdrant-monitoring-setup` in `setup/`); `anthropics/skills` `template/` declares `template-skill`; `tech-leads-club/agent-skills` uses `(category)/` grouping folders and names that differ from the folder (3). `anthropics/skills` `claude-api` description is 1,068 characters (limit 1,024); `neondatabase/agent-skills` has an eval skill with no `description`. These are genuine against the written spec. Whether they are *intentional* conventions is for each maintainer: runtimes that ignore the match rule load them fine. `blader/humanizer` is a scan-root artefact (the repository is cloned into a folder whose name differs from the skill name); the message says so.

**skills-ref agrees on every one of these (27 skills flagged by both, 0 flagged only by SkillPath Guard).**

### MISSING_REFERENCE (63): 9 genuine, 54 intentional or illustrative (my reading)
47 findings (microsoft, awesome-copilot, getsentry, huggingface, dotnet, tech-leads-club, wshobson, trailofbits) were read at their source line. The other 16 (openai 14, obra/superpowers 2) were classified from their target names and the purpose of the files (`skill-creator`, `writing-skills`, `hatch-pet`); I did not read those lines in this round.

| Class | Count | Examples |
|---|---|---|
| Genuine broken link / missing file | 9 | `microsoft/skills` `azure-mgmt-apimanagement-dotnet` links `references/policies.md`; `azure-cosmos-py` links `scripts/setup_cosmos_container.py`; `github/awesome-copilot` `gdpr-compliant` links `references/operations.md`; `wshobson/agents` `ml-pipeline-workflow` (4) and `grounded-vault` `scripts/check_vault.py` (searched the whole clone: no such file); `tech-leads-club` `render-deploy` links the directory `assets/` (absent) |
| Illustrative text in a skill-writing guide | 33 | `microsoft/skills` `skill-creator` (17), `openai/skills` `skill-creator` (12), `obra/superpowers` `writing-skills` (`scripts/tool.sh`), `dotnet/skills` `create-skill` (2) |
| File the skill tells the agent to create or ask for | 10 | `microsoft/skills` `wiki-onboarding` (4 guides generated for the user), `wiki-ado-convert` (script it generates); `create-canvas-extension` `assets/preview.png`; `openai/skills` `hatch-pet` (`references/canonical-base.png`, created at run time) |
| Plugin-level resource (exists one level above the skill) | 4 | `trailofbits/skills` `rust-review` and `testing-handbook-generator` use `scripts/*.py` that live at the plugin root (verified to exist) |
| Placeholder / optional / negative example | 7 | `references/filename.md`, "if `references/firm-standards.md` is present", `./scripts/deploy.sh` as an example of what *not* to include (getsentry), user-supplied `./scripts/train.py` in a code sample (huggingface), directory convention `scripts/azd` |

The classes sum to 63 (9+33+10+4+7). Single reviewer; the `hatch-pet` run-time claim was checked only by grepping the skill text. The classes match the known false-positive classes in CORPUS_VALIDATION.md: they need semantic judgement, so the tool keeps them as errors and offers `<!-- skillpath-guard-ignore -->`. **No new scanner defect (wrong parse of a link) was found in the MISSING_REFERENCE set this round.**

### CASE_MISMATCH (3): genuine
`github/awesome-copilot` `gdpr-compliant` links `references/security.md`; the file is `references/Security.md`. Works on macOS/Windows, broken on Linux. A true positive that skills-ref cannot see (it does not check references).

### SYMLINK_BROKEN (10): genuine in the checkout
`microsoft/skills` `.github/plugins/microsoft-foundry/skills/*` are symlinks to `../../azure-skills/skills/...`, which is absent from the checkout. Could be an intentional layout resolved at publish time; as checked in, the skills cannot load.

## False negatives found (defects the tool missed)

| Case | Tool behaviour | Fixed? |
|---|---|---|
| `description: "unterminated` (unclosed quote) in frontmatter | v0.3.2 accepted it silently; skills-ref rejects it as invalid YAML | **Yes**, unreleased: `FRONTMATTER_UNSUPPORTED` (regression tests added). None of the 25 repositories contains this, so corpus output is unchanged (407 findings before and after) |
| Unknown frontmatter fields (`argument-hint`, `disable-model-invocation`, `version`, ...) | not checked (by design) | No. skills-ref flags 82 skills for this. These are runtime extensions in widespread use (Claude Code, VS Code); whether to warn is a policy decision. Left unchanged |
| Real YAML validity beyond name/description | SkillPath Guard parses a subset, so it cannot reject all YAML that a strict parser rejects | Documented limitation (README) |

## False positives of the *other* tool noticed in passing
`skills-ref` 0.1.1 uses `strictyaml`, which rejects YAML flow sequences. `allowed-tools: ['A', 'B']` (awesome-copilot `azure-role-selector`) and `argument-hint: [apk-file-or-directory]` (trailofbits `firebase-apk-scanner`) are valid YAML but reported as "Invalid YAML". Also reproduced on a fixture. This is a property of the reference validator, listed here only as evidence for the comparison; no one has been told.

## Performance
Largest scans: `github/awesome-copilot` 478 skills in 0.70 s, `microsoft/skills` 211 skills in 0.62 s, `K-Dense-AI/scientific-agent-skills` 177 skills in 0.80 s. No bottleneck on this corpus. Earlier rounds measured a 9,013-skill repository at about 22 s.

## Reproduce
```sh
mkdir spg && cd spg && npm init -y && npm i skillpath-guard@0.3.2
git clone --depth 1 <url> repo && git -C repo checkout <sha>   # or fetch the exact commit
npx skillpath-guard scan repo --format json --out report.json
```
Clone depth 1 fetches the default branch head, which is what the SHAs above record; repositories move, so a later clone will differ.

## Gaps in this validation
- One reviewer, no second opinion. The PATH_ESCAPE set was not re-read this round. AMBIGUOUS_CWD was not run (it is opt-in since 0.3.0).
- Selection is not random: popular, public, mostly well-maintained repositories found by earlier sessions plus a few new ones (vercel-labs, langchain-ai, neondatabase, firebase, tech-leads-club). At least 20 of the 25 were already scanned in earlier rounds, so this is not independent of the tool's history (to my knowledge, new here: vercel-labs, langchain-ai and neondatabase).
- No runtime check that any flagged skill actually fails to load in a given agent.
