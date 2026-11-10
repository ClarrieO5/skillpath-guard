# Contribution ledger

Every external issue or pull request made from this work, with its real status. Updated 2026-11-10 (after the v0.2.1 release). Nothing is counted until a maintainer merges it.

| Date | Repository | Item | Status | Outcome |
|---|---|---|---|---|
| 2026-11-09 | shanraisshan/claude-code-best-practice | PR #283 "Remove dead links to references/ and templates/ in agent-browser skill" | Open, 0 comments (re-checked 2026-11-10) | Duplicate of #142; closing comment drafted below, **not posted** (awaiting your approval) |

Merged external PRs: **0**. Open: **1** (duplicate). Issues filed: **0**.

Prepared but **not submitted** (awaiting your approval): see `docs/CONTRIBUTION_RESEARCH_2026-11.md` for the full evidence.

| Rank | Repository | Type | Patch |
|---|---|---|---|
| 1 | github/awesome-copilot | PR | `docs/patches/awesome-copilot-gdpr-compliant.patch`; description: `docs/drafts/awesome-copilot-gdpr-compliant-PR.md`. **Ready.** Re-checked 2026-11-10 at upstream e45ee93: still broken, no duplicate. Their `npm run skill:validate` (460 skills) and `npm start` both pass with the patch, and `npm start` changes nothing else. Their validator also passes the *unpatched* skill, so it does not catch this bug. Your fork `ClarrieO5/awesome-copilot` exists (at e45ee93); the branch has not been pushed yet. |
| 2 | wshobson/agents | PR | `docs/patches/wshobson-agents-ml-pipeline-workflow.patch`. **Check issue #447 first:** an earlier draft (ClarrieO5/skillpath-guard PR #9) cites it as "same symptom, closed". Find out why it was closed before submitting. |
| 3 | microsoft/skills | PR | `docs/patches/microsoft-skills-dead-reference-links.patch` |
| 4 | firebase/agent-skills | Issue | none (maintainer decision) |
| 5 | anthropics/skills, Yuan1z0825/nature-skills | Issue | none (from round 1, still valid 2026-11-10) |

## PR #283 vs PR #142 (checked 2026-11-10)

Both PRs change `.claude/skills/agent-browser/SKILL.md` starting from the same file version (blob `5cd897a`, which is still the version on `main` at 1a045f7).

- **#283 (ours):** deletes the "Deep-Dive Documentation" and "Ready-to-Use Templates" sections, 25 lines.
- **#142** (HidingCook, opened 2026-07-06, last updated 2026-10-11, 0 comments, not merged): its commit 6d2aad0 deletes **the same 25 lines** and adds a two-line "Full Command Reference" section pointing to `agent-browser --help`. It also fixes stale paths in three `presentation/` skills.

**Conclusion: #142 completely covers #283** and adds a helpful replacement pointer. #283 adds nothing that #142 lacks. Recommendation: close #283 with the comment below.

Context on acceptance: the repository has merged only 5 PRs from people other than the owner, the most recent on 2026-04-23; 39 others were closed unmerged. #142 has waited four months. So neither PR is likely to merge soon, and keeping a duplicate open does not improve the odds.

### Draft closing comment (post only if you approve)

> Closing this as a duplicate of #142, which removes the same dead `references/` and `templates/` links in `agent-browser/SKILL.md` (and also adds a pointer to `agent-browser --help`). I opened this before noticing #142. Sorry for the noise, and thanks for maintaining the repo.

## Rules this ledger follows

- Search open and closed issues and PRs before submitting anything; record the search here.
- One small, verified fix per PR. No PRs made to raise a count.
- Record outcomes (merged, closed, no response) as they happen, including failures.
