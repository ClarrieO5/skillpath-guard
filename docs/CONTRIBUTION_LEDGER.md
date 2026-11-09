# Contribution ledger (evidence only)

Last checked: 2026-11-09 (second session), via the GitHub search API (public data). "Verified" means I read the URL's data myself this session; nothing here is inferred.

## Submitted

| # | Repository | Item | Opened | State (2026-11-09) | Evidence |
|---|---|---|---|---|---|
| 1 | shanraisshan/claude-code-best-practice | PR #283 "Remove dead links to references/ and templates/ in agent-browser skill" | 2026-11-09 22:03 UTC | **open**, not merged, 0 comments, 0 reviews seen | https://github.com/shanraisshan/claude-code-best-practice/pull/283 |

## Merged

None. Merged external contributions: **0**.

## Overlap check: PR #283 vs PR #142 (resolved 2026-11-09)

**They overlap.** PR #142 by HidingCook (open since 2026-07-06, last updated 2026-10-11, 0 comments, unreviewed for about 4 months) contains commit 6d2aad0, which removes the same 6 `references/*.md` and 3 `templates/*.sh` links from `.claude/skills/agent-browser/SKILL.md` and adds a three-line "Full Command Reference" pointer to `agent-browser --help`. I read both diffs from the fetched PR refs. #142 also bundles other skill-path fixes in a larger change; #283 is the single-purpose version. Nothing was commented or closed; maintainer not contacted.

Likelihood context: that repo's external PRs (not by the maintainer): 5 merged, 39 closed unmerged. Most merges are the maintainer's automated drift checks. Upstream at 1a045f7 still has the 9 dead links.

## Investigated and not filed (with reasons)

| Candidate | Result |
|---|---|
| Yuan1z0825/nature-skills: `name: researchwrite` vs folder `nature-proposal-writer` | **Not a defect.** Deliberate compatibility alias: SKILL.md line 15 says not to rename without a migration plan; `manifest.yaml` has a design note; `scripts/validate-skill-metadata.py` allowlists it (`COMPATIBILITY_SKILL_NAMES`); both READMEs document it. A bug report would be inaccurate. See the optional question below. |
| anthropics/skills: `claude-api` description is 1,068 chars (limit 1,024) | **Real but duplicate.** Issues #1613, #881, #1622 and PRs #2050, #2060, #1956, #1616, #1684, #1635 are already open. Adding another would be noise. |
| microsoft/skills: dead links in azure-cosmos-py, wiki-onboarding, azure-monitor-ingestion-java, apim | **Real but already reported**: issues #422, #464 (and closed PR #430). |
| vercel-labs/agent-skills: 4 skills whose `name` is `vercel-*` but folder is not | Already reported (#80, #112) and a fix PR (#114) was closed; the prefixed names are referenced by other skills. Not ours to reopen. |
| huggingface/skills, openai/skills, addyosmani/agent-skills | Scanner hits are placeholders (`train_<type>_example.py`), counter-examples (`# ❌ These will all fail`), generated output files, or skill-creator illustrations. False positives; no defect found. |
| marketingskills, superpowers, nature-skills `../` sibling links | Design choice (shared folders); would need a question, not a patch. |
| anthropics/claude-plugins-official, cloudflare/skills, expo/skills, trailofbits/skills, wshobson llm-finetuning | Scanner hits are explicit cross-skill or plugin-root references (e.g. "`agents-sdk` skill, its `references/mcp.md`"); the files exist in the named skill. Scanner limitation, documented in README. |

## New candidate prepared (not filed)

| Repo | Finding | Draft |
|---|---|---|
| wshobson/agents (9c61ab2) | `ml-pipeline-workflow` lists 7 reference/asset files (4 `references/*.md`, 3 `assets/*`) that exist nowhere in the repo. No duplicate issue or PR found. Precedent: #447 (same symptom, closed). | `docs/drafts/ISSUE_wshobson-agents_ml-pipeline-workflow.md` |

Issue rather than PR: the missing content is the maintainer's to author, and removing pointers is their call. Only worth filing if you agree.

## Optional low-key question for nature-skills (not recommended unless you want it)

Only if you specifically want to ask: *"Thanks for the clear compatibility note on `researchwrite`. Do you plan a migration (e.g. an alias or a rename) so tools that follow the Agent Skills spec's name-equals-folder rule, such as `skills-ref validate`, can pass? No action needed if the alias is permanent; I'm asking so I can document it correctly in a validator I maintain."* This is a question, not a bug report, and low value to them.

## Result against the "up to five contributions" goal

One contribution is submitted (#283, open, and subsumed by older open #142). One new real, unreported finding is drafted (wshobson/agents). I am deliberately not padding the list to five.
