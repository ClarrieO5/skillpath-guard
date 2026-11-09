# Contribution ledger (evidence only)

Last checked: 2026-11-09, via the GitHub search API (public data). "Verified" means I read the URL's data myself this session; nothing here is inferred.

## Submitted

| # | Repository | Item | Opened | State (2026-11-09) | Evidence |
|---|---|---|---|---|---|
| 1 | shanraisshan/claude-code-best-practice | PR #283 "Remove dead links to references/ and templates/ in agent-browser skill" | 2026-11-09 22:03 UTC | **open**, not merged, 0 comments, 0 reviews seen | https://github.com/shanraisshan/claude-code-best-practice/pull/283 |

## Merged

None. Merged external contributions: **0**.

## Context on likelihood (measured, not guessed)

- That repo's external PRs (not by the maintainer): 5 merged, 39 closed without merging, so roughly 1 in 9 historically merged. Most merged PRs on the repo are the maintainer's own automated drift checks. Treat #283 as low-to-moderate odds even though the fix is correct.
- Open PR #142 by another contributor ("repair stale paths and dead links in local skills") may touch the same skill. I could not read it (rate limit hit); check whether it overlaps #283 before expecting a merge.
- Upstream at 1a045f7 (2026-11-09) still reports the 9 dead links, so the premise of #283 holds.

## Investigated and not filed (with reasons)

| Candidate | Result |
|---|---|
| Yuan1z0825/nature-skills: `name: researchwrite` vs folder `nature-proposal-writer` | **Not a defect.** Deliberate compatibility alias: SKILL.md line 15 says not to rename without a migration plan; `manifest.yaml` has a design note; `scripts/validate-skill-metadata.py` allowlists it (`COMPATIBILITY_SKILL_NAMES`); both READMEs document it. A bug report would be inaccurate. See the optional question below. |
| anthropics/skills: `claude-api` description is 1,068 chars (limit 1,024) | **Real but duplicate.** Issues #1613, #881, #1622 and PRs #2050, #2060, #1956, #1616, #1684, #1635 are already open. Adding another would be noise. |
| microsoft/skills: dead links in azure-cosmos-py, wiki-onboarding, azure-monitor-ingestion-java, apim | **Real but already reported**: issues #422, #464 (and closed PR #430). |
| vercel-labs/agent-skills: 4 skills whose `name` is `vercel-*` but folder is not | Already reported (#80, #112) and a fix PR (#114) was closed; the prefixed names are referenced by other skills. Not ours to reopen. |
| huggingface/skills, openai/skills, addyosmani/agent-skills | Scanner hits are placeholders (`train_<type>_example.py`), counter-examples (`# ❌ These will all fail`), generated output files, or skill-creator illustrations. False positives; no defect found. |
| marketingskills, superpowers, nature-skills `../` sibling links | Design choice (shared folders); would need a question, not a patch. |

## Optional low-key question for nature-skills (not recommended unless you want it)

Only if you specifically want to ask: *"Thanks for the clear compatibility note on `researchwrite`. Do you plan a migration (e.g. an alias or a rename) so tools that follow the Agent Skills spec's name-equals-folder rule, such as `skills-ref validate`, can pass? No action needed if the alias is permanent; I'm asking so I can document it correctly in a validator I maintain."* This is a question, not a bug report, and low value to them.

## Result against the "up to five contributions" goal

One valid contribution exists (#283, already submitted). I found no other finding that is both real and not already reported. I am deliberately not padding the list to five.
