# Contribution ledger

Every external issue or pull request made from this work, with its real status. Nothing is counted until a maintainer merges it.

Last verified: **2026-11-10**, third session. Method: GitHub search API (`author:ClarrieO5 -user:ClarrieO5`, PRs and issues separately), `git ls-remote` of the PR refs and of your forks, and fresh shallow clones of each upstream.

## Submitted

| Date | Repository | Item | Status (2026-11-10) | Outcome |
|---|---|---|---|---|
| 2026-11-09 | shanraisshan/claude-code-best-practice | PR #283 "Remove dead links to references/ and templates/ in agent-browser skill" (head `dc84579`, branch `fix-agent-browser-broken-links` in your fork) | Open, not merged, 0 comments | Fully overlapped by older open #142 (see below). Left open; nothing posted. |

Totals: merged external PRs **0**; open **1**; issues filed **0**. Search finds no other PR or issue by ClarrieO5 outside this repository.

## PR #283 vs PR #142 (re-verified 2026-11-10)

Both PR heads were fetched (`refs/pull/283/head` = `dc84579`, `refs/pull/142/head` = `6d2aad0`, unchanged since 2026-07-06) and diffed against upstream `main` `1a045f7`.

- Both edit `.claude/skills/agent-browser/SKILL.md` from the same blob, `5cd897a`, which is still the version on `main`. All 9 dead links are still on `main` (lines 198-216).
- **#283** deletes the "Deep-Dive Documentation" and "Ready-to-Use Templates" sections (25 lines). It changes only that file.
- **#142** (HidingCook, opened 2026-07-06, last updated 2026-10-11, 0 comments) deletes the same 25 lines in commit 6d2aad0, adds a "Full Command Reference" pointer to `agent-browser --help`, and fixes paths in three `presentation/` skills.

**Result: they overlap completely.** Every line #283 removes, #142 also removes. #283 has nothing #142 lacks, so if either one merges, the other becomes a conflict.

Your instruction was to leave #283 open only if there was no overlap. There is overlap, but closing it would be a public action on GitHub, so it is still open and nothing has been posted. The options are in `docs/STATUS.md`.

Acceptance context, from the round-2 check: the repository has merged 5 PRs from people other than the owner, the latest on 2026-04-23, and closed 39 others unmerged. #142 has waited four months.

### Draft closing comment (only if you choose to close with a comment)

> Closing this as a duplicate of #142, which removes the same dead `references/` and `templates/` links in `agent-browser/SKILL.md` (and also adds a pointer to `agent-browser --help`). I opened this before noticing #142. Sorry for the noise, and thanks for maintaining the repo.

## Prepared, not submitted (each needs your approval)

Re-checked 2026-11-10 against fresh clones; full evidence is in `docs/CONTRIBUTION_RESEARCH_2026-11.md`.

| Rank | Repository (upstream commit) | Type | Status |
|---|---|---|---|
| 1 | github/awesome-copilot (6afbe78) | PR | **Ready.** Patch `docs/patches/awesome-copilot-gdpr-compliant.patch`, description `docs/drafts/awesome-copilot-gdpr-compliant-PR.md`. Still broken upstream (3 `CASE_MISMATCH`, 1 `MISSING_REFERENCE`). No duplicate: searched PRs and issues for "gdpr" and "Security.md"; the only hits are the original add (#1230), unrelated skills and automated staleness reports. Re-checked 2026-11-10 at upstream 6afbe78: still broken, same searches (plus "operations.md", "case-sensitive") find no duplicate. Fix branch `fix-gdpr-compliant-reference-paths` (a854019, on 6afbe78) pushed to fork `ClarrieO5/awesome-copilot`; upstream PR **not opened**. |
| 2 | wshobson/agents (9c61ab2) | PR | **Ready, pending their checks.** Patch `docs/patches/wshobson-agents-ml-pipeline-workflow.patch`. Still broken upstream. The open question about issue #447 is resolved: #447 (missing resources in `debugging-strategies`) was closed because it was **fixed**, not declined. That skill now ships `references/`, after the maintainer split oversized skills in #771. Together with #514 and #742 this shows the maintainer accepts dead-reference fixes. No duplicate: 0 issues and 0 relevant PRs for "ml-pipeline". Their `make validate/garden/test` have still not been run. |
| 3 | firebase/agent-skills (99954a3) | PR (upgraded from issue) | **Ready; needs the Google CLA.** Patch `docs/patches/firebase-agent-skills-data-connect-name.patch`, description `docs/drafts/firebase-agent-skills-data-connect-name-PR.md`. `skills/firebase-data-connect-basics/SKILL.md` has `name: firebase-data-connect`. It is the only one of 14 skills whose name differs from its folder. New evidence: the maintainer fixed this exact problem for two other skills by changing `name:` to the folder name (merged PR #93, 2026-04-27), and firebase-tools' own Data Connect MCP tools (`src/mcp/tools/dataconnect/compile.ts`, `execute.ts`) tell agents to follow "the `firebase-data-connect-basics` skill", a name that no skill declares. No duplicate: open PR #141 edits the same file but keeps the old name; #144 and #160 change content only. |
| ~~4~~ | microsoft/skills | — | **Withdrawn: duplicate.** Both rows in `docs/patches/microsoft-skills-dead-reference-links.patch` are already reported: `references/policies.md` in issue #422, with open fix PR #448 (which supersedes the closed #430), and `scripts/setup_cosmos_container.py` in open issue #464. Round 2 said "no duplicates"; that was wrong. Do not submit. The patch file is kept only as a record. |
| ~~5~~ | anthropics/skills | — | **Withdrawn: duplicate.** The `claude-api` description length is already reported in open issues #1613, #881 and #1622 and in open PRs #1616, #1635, #1684, #1956, #2050 and #2060. |
| ~~6~~ | Yuan1z0825/nature-skills | — | **Withdrawn: not a defect.** `name: researchwrite` in folder `nature-proposal-writer` is a deliberate alias: the repository's own `scripts/validate-skill-metadata.py` allowlists it (`COMPATIBILITY_SKILL_NAMES`). |

## Rules this ledger follows

- Search open and closed issues and PRs before submitting anything; record the search here.
- One small, verified fix per PR. No PRs made to raise a count.
- Record outcomes (merged, closed, no response) as they happen, including failures and corrections to earlier entries.
