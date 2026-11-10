# Contribution ledger

Every external issue or pull request made from this work, with its real status. Nothing is counted until a maintainer merges it.

Last verified: **2026-11-10**, fourth session. Method: GitHub search API (`author:ClarrieO5 -user:ClarrieO5`, PRs and issues separately), `git ls-remote` of the PR refs and of your forks, and fresh shallow clones of each upstream.

## Submitted

| Date | Repository | Item | Status (2026-11-10) | Outcome |
|---|---|---|---|---|
| 2026-11-10 | github/awesome-copilot | [PR #6339](https://github.com/github/awesome-copilot/pull/6339) "fix(gdpr-compliant): repair reference paths that fail on case-sensitive file systems" (branch `fix-gdpr-compliant-reference-paths`; commits a854019 + merge of `main` 468d152) | Open, label `ready-for-review`, 0/1 required approvals. Only bot activity: risk scan clean, vally lint 0 errors, all submission-gate checks passed, two Copilot reviews "Approval recommended". No human review, no change request. | Waiting for a maintainer. Do not touch unless changes are requested. |
| 2026-11-09 | shanraisshan/claude-code-best-practice | PR #283 "Remove dead links to references/ and templates/ in agent-browser skill" (head `dc84579`, branch `fix-agent-browser-broken-links` in your fork) | Open, not merged, 0 comments | Fully overlapped by older open #142 (see below). Left open; nothing posted. |

Totals: merged external PRs **0**; open **2** (#6339, #283); issues filed **0**. Search finds no other PR or issue by ClarrieO5 outside this repository.

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
| ~~1~~ | github/awesome-copilot | PR | **Submitted 2026-11-10 as #6339** (see table above). |
| 2 | wshobson/agents (9c61ab2, unchanged 2026-11-10) | PR | **Ready.** Patch `docs/patches/wshobson-agents-ml-pipeline-workflow.patch`, description (in their PR template) `docs/drafts/wshobson-agents-ml-pipeline-workflow-PR.md`. Re-checked in session 4: patch applies; still broken (4 errors before, 0 after); duplicate searches ("ml-pipeline", "machine-learning-ops", "missing references", issues and PRs) find nothing for this skill (#116 and #416 are other skills, both fixed). Run: JSON parse of all 5 changed files, markdownlint with their config (0 errors), skills-ref (valid). Read, not run: their version-bump, gardener and snapshot checks all accept the change (details in the draft). **Not run:** `make validate STRICT=1 / garden / test / smoke-test` (blocked by the session permission system). |
| 3 | firebase/agent-skills (99954a3) | PR (upgraded from issue) | **Ready; needs the Google CLA.** Patch `docs/patches/firebase-agent-skills-data-connect-name.patch`, description `docs/drafts/firebase-agent-skills-data-connect-name-PR.md`. `skills/firebase-data-connect-basics/SKILL.md` has `name: firebase-data-connect`. It is the only one of 14 skills whose name differs from its folder. New evidence: the maintainer fixed this exact problem for two other skills by changing `name:` to the folder name (merged PR #93, 2026-04-27), and firebase-tools' own Data Connect MCP tools (`src/mcp/tools/dataconnect/compile.ts`, `execute.ts`) tell agents to follow "the `firebase-data-connect-basics` skill", a name that no skill declares. No duplicate: open PR #141 edits the same file but keeps the old name; #144 and #160 change content only. Session 4: upstream `main` still 99954a3; `next` (7af7804) has the same mismatch; open PRs #141, #144, #160, #207 all keep the old name (checked in each PR head). `mdformat --wrap 80 --check` (what their CI runs) passes; **skills-ref fails before** ("Directory name ... must match skill name") **and passes after**. CLA: Google individual CLA at https://cla.developers.google.com/ ; the commit author email must be the CLA email. |
| 3b | tech-leads-club/agent-skills (8658b66) | Issue (repo is issue-first for non-members) | **Ready.** Draft `docs/drafts/tech-leads-club-routing-names-ISSUE.md`: 4 descriptions route to nonexistent skill names. Duplicate search done (round 4 below); open PR #226 covers only the dead links, not the descriptions. |
| ~~4~~ | microsoft/skills | — | **Withdrawn: duplicate.** Both rows in `docs/patches/microsoft-skills-dead-reference-links.patch` are already reported: `references/policies.md` in issue #422, with open fix PR #448 (which supersedes the closed #430), and `scripts/setup_cosmos_container.py` in open issue #464. Round 2 said "no duplicates"; that was wrong. Do not submit. The patch file is kept only as a record. |
| ~~5~~ | anthropics/skills | — | **Withdrawn: duplicate.** The `claude-api` description length is already reported in open issues #1613, #881 and #1622 and in open PRs #1616, #1635, #1684, #1956, #2050 and #2060. |
| ~~6~~ | Yuan1z0825/nature-skills | — | **Withdrawn: not a defect.** `name: researchwrite` in folder `nature-proposal-writer` is a deliberate alias: the repository's own `scripts/validate-skill-metadata.py` allowlists it (`COMPATIBILITY_SKILL_NAMES`). |

## Round 4 (2026-11-10): 14 more active repositories

Fresh `git clone --depth 1`, scanned with SkillPath Guard at `main` 23c2db3, and every error read by hand. Commits are the upstream HEAD on 2026-11-10.

| Repository (commit) | Scan | Verdict |
|---|---|---|
| tech-leads-club/agent-skills (8658b66) | 16 errors | **Real, new:** 4 descriptions route agents to skill names that do not exist (`use web-accessibility` x3, real name `accessibility`; `use create-technical-design-doc`, real name `technical-design-doc-creator`). Their installer and `install -s` match `name:`, so the hint fails. Draft issue `docs/drafts/tech-leads-club-routing-names-ISSUE.md` (issue-first repo). **Duplicate, dropped:** the dead `../performance/SKILL.md` and `[assets/](assets/)` links are already fixed in open PR #226. 5 other `PATH_ESCAPE` links resolve after install (skills install under `name:`). `scripts/backfill-feature.ts` is an illustrative example (known FP class). |
| googleworkspace/cli (cd3697e) | 75 `PATH_ESCAPE` | Sibling links (`../gws-shared/SKILL.md`), all targets exist. Design choice; nothing to fix. |
| databricks/databricks-agent-skills (ff3e827) | 456 `PATH_ESCAPE`, 765 `AMBIGUOUS_CWD` | All escaping targets exist. Design choice. |
| elastic/agent-skills (09d879d) | 28 `NAME_INVALID` | Deliberate: folders are grouped by plugin and `scripts/install-skills.sh` installs by frontmatter `name` (e.g. `cloud-onboarding`). Not a defect. |
| Kotlin/kotlin-agent-skills (087f568) | 6 `PATH_ESCAPE` | Sibling links, targets exist. |
| WordPress/agent-skills (7374e6f) | 2 `PATH_ESCAPE` | Sibling links, targets exist. |
| Leonxlnx/taste-skill (f6b7657) | 1 `NAME_INVALID` | Deliberate: `name: design-taste-frontend` in `skills/taste-skill/`; its `references/gate.md` documents both install folders. Not submitted. |
| dbt-labs/dbt-agent-skills (b8facde) | 2 `MISSING_REFERENCE` | `uv run scripts/validate_repo.py` in a repo-internal `.claude/skills` skill; the script exists at the repo root. Known FP class (repo-root scripts). |
| pbakaus/impeccable (ec229b4), ClickHouse/agent-skills (d3b2b5b), laravel/agent-skills (a24ba69), MicrosoftDocs/Agent-Skills (9b16b5c), apify/agent-skills (f22557f), phuryn/pm-skills (9af7bfd) | 0 errors | Nothing to report. |

Result: 1 new upstream candidate (tech-leads-club, issue). No new SkillPath Guard bug. Considered and **rejected**: reporting a `PATH_ESCAPE` whose target is missing as a broken link. On this corpus only 2 of 7 such links were broken (the other 5 resolve after install), and those 2 were already fixed in an open PR.

## Rules this ledger follows

- Search open and closed issues and PRs before submitting anything; record the search here.
- One small, verified fix per PR. No PRs made to raise a count.
- Record outcomes (merged, closed, no response) as they happen, including failures and corrections to earlier entries.
