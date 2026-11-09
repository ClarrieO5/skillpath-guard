# Contribution research, round 2 (2026-11-10)

Nothing here has been submitted. Every finding below was checked by hand against a fresh shallow clone of the upstream default branch; scanner output was only the starting point.

## Method

1. Shallow-cloned 38 public repositories not covered in round 1 (`docs/CORPUS_VALIDATION.md`). 31 of 38 had commits after 2026-10-10; the oldest last commit was 2026-04-28 (travisvn/awesome-claude-skills).
2. Scanned each with SkillPath Guard `main` (0.2.0 + the NAME_INVALID hint).
3. Read every `MISSING_REFERENCE`, `CASE_MISMATCH`, `NAME_INVALID`, `DESCRIPTION_INVALID` and `COMPATIBILITY_INVALID` finding in context (the source line, the skill folder, sibling skills, and the repo's README/CONTRIBUTING). `AMBIGUOUS_CWD` and `PATH_ESCAPE` were not pursued: round 1 showed they are mostly deliberate layouts.
4. For promising findings: checked the file's history where possible, searched the repo's issues and pull requests for duplicates, and read the contribution rules.
5. Prepared the smallest fix as a `git format-patch` file and confirmed it applies to current `main`.

Running the target repositories' own build or validation scripts was **blocked by this session's permission policy** (it counts as executing third-party code). Validation is therefore SkillPath Guard plus manual review; each candidate lists the upstream check you or CI still need to run.

## Repositories investigated (38)

Contained skills (33): vercel-labs/agent-browser, vercel-labs/agent-skills, anthropics/claude-plugins-official, anthropics/claude-cookbooks, openai/skills, github/awesome-copilot, huggingface/skills, trailofbits/skills, getsentry/skills, supabase/agent-skills, expo/skills, remotion-dev/skills, cloudflare/skills, microsoft/skills, dotnet/skills, hashicorp/agent-skills, neondatabase/agent-skills, callstackincubator/agent-skills, better-auth/skills, wshobson/agents, davila7/claude-code-templates, alirezarezvani/claude-skills, jezweb/claude-skills, mitsuhiko/agent-stuff, czlonkowski/n8n-skills, langchain-ai/langchain-skills, stripe/ai, firebase/agent-skills, google-gemini/gemini-skills, posthog/skills, sanity-io/agent-toolkit, mongodb/agent-skills, pulumi/agent-skills.

No SKILL.md (5): anthropics/claude-code, agentskills/agentskills, VoltAgent/awesome-agent-skills, hesreallyhim/awesome-claude-code, travisvn/awesome-claude-skills.

Also re-checked from round 1 (upstream had new commits): shanraisshan/claude-code-best-practice, anthropics/skills, Yuan1z0825/nature-skills.

Totals before triage: 3,375 skills (including mirrored copies), 514 `MISSING_REFERENCE`, 3 `CASE_MISMATCH`, 149 `NAME_INVALID`.

## Confirmed and prepared (ranked by developer benefit x confidence)

### 1. github/awesome-copilot: `gdpr-compliant` reference paths break on Linux (PR)
- **Problem:** `skills/gdpr-compliant/SKILL.md` lines 15, 156 and 194 point to `references/security.md`; the file is `references/Security.md`. Line 16 points to `references/operations.md`, which does not exist; its content (cloud, CI/CD, incident response, architecture) is in `Security.md`, whose title is "Security, Operations & ...". A commit search for "gdpr" finds only the original add (7454bbdb, PR #1230), so this has likely been wrong since the skill was added.
- **Impact:** on case-sensitive file systems (Linux, most CI and containers) an agent following any of the three links gets file-not-found; on every OS the operations link fails. macOS and Windows hide the case problem, which is why it went unnoticed.
- **Reproduce:** `node src/cli.mjs scan <clone>/skills/gdpr-compliant` -> 3 `CASE_MISMATCH`, 1 `MISSING_REFERENCE`. `ls skills/gdpr-compliant/references` shows `Security.md data-rights.md`.
- **Fix:** `docs/patches/awesome-copilot-gdpr-compliant.patch` (base b13e55f): rename `Security.md` -> `security.md` (matches the repo's "lowercase filenames" convention and all three existing links), fold the operations bullet into the security bullet, and update the generated line in `docs/README.skills.md` to what `eng/update-readme.mjs` would produce (asset list is `.sort()`ed, so `data-rights.md` now comes first). After the patch the scan reports 0 errors.
- **Validated 2026-11-10** at upstream e45ee93 (`npm ci --ignore-scripts`): with the patch, `npm run skill:validate` passes (460 skills), `npm start` exits 0 and changes no other files, and line endings stay LF. Their validator also passes the **unpatched** skill, so their tooling does not catch this class of bug. The patch still applies cleanly to e45ee93.
- **Duplicates:** none (searched issues and PRs for "gdpr" and "Security.md"; re-checked 2026-11-10).
- **Rules:** fork, branch from `main` (not `staged`), PR to `main`. Small edits to existing resources are the `merge-risk:low` tier.
- **Acceptance:** high (about 75%). Clear bug, tiny diff, low-risk tier, very active repo. Uncertainty: high PR volume, and a maintainer might prefer editing the links instead of renaming the file (either is fine; offer it).
- **Note for you:** CONTRIBUTING.md asks AI agents to append `🤖🤖🤖` to PR titles for "fast-tracking". Treat that as the maintainers' way to identify AI-assisted PRs. Whether you include it is your decision; be honest about how the change was prepared.

### 2. wshobson/agents: `ml-pipeline-workflow` points to seven files that do not exist (PR)
- **Problem:** `plugins/machine-learning-ops/skills/ml-pipeline-workflow/SKILL.md` has a "Reference Documentation" section listing four `references/*.md` guides, an "Assets and Templates" section listing three `assets/` files, and four `# See references/...` / `# See assets/...` comments. The skill folder contains only `SKILL.md`.
- **Impact:** an agent told to "see the `references/` directory for detailed guides" spends tool calls looking for files that do not exist, then either stops or improvises.
- **Why their own checker missed it:** the repo has a dead-reference checker (`plugin-eval`, `DEAD_CROSS_REF`), but the names are bold text and code comments, not links. SkillPath Guard caught 3 of the 11 pointers (the `# See` lines); the rest were found by reading the file.
- **Fix:** `docs/patches/wshobson-agents-ml-pipeline-workflow.patch` (base 9c61ab2): remove the two sections and the four comments; bump `machine-learning-ops` 1.2.3 -> 1.2.4 in all five places the version appears, as CONTRIBUTING requires ("a change without a bump never reaches people who already installed it").
- **Not run:** `make generate-all`, `make validate STRICT=1`, `make garden`, `make test`. `evals/static-score-snapshot.json` holds a content digest for this skill; if CI flags it, run `make eval-snapshot` and include the result.
- **Duplicates:** none found by search. Similar dead-link reports (#514, #742) were accepted and fixed, which is good evidence the maintainer wants these. **Open question:** an earlier draft (ClarrieO5/skillpath-guard PR #9) cites wshobson issue #447 as "same symptom, closed". Read #447 before submitting; if the maintainer declined that fix, do not resubmit.
- **Acceptance:** high (about 70%). 176 merged PRs from non-owners, 35 since September. Uncertainty: the maintainer might prefer writing the missing guides; the PR description should offer that.

### 3. microsoft/skills: two reference-table rows link to missing files (PR)
- **Problem:** `azure-mgmt-apimanagement-dotnet/SKILL.md:311` links `references/policies.md`; that file was not in the skill at 25e23b2 (2026-01-28, when its SKILL.md already linked it) and is not there now. `azure-cosmos-py/SKILL.md:306` links `scripts/setup_cosmos_container.py`; it was added in 06fffee5 under `skills/python/data/cosmos/scripts/` and was not carried over when the skill moved to its plugin folder.
- **Fix:** `docs/patches/microsoft-skills-dead-reference-links.patch` (base 84666ab): delete the two rows. Restoring the 334-line Cosmos script from 06fffee5 is the alternative, but it would need testing against the current `azure-cosmos` SDK and an Azure account, so the patch takes the smaller step and the PR text should offer the restore.
- **Duplicates:** none for these files. Not affected by the open plugin PR #414.
- **Rules:** no CONTRIBUTING.md; README "Contributing" section. Microsoft repos require signing the Microsoft CLA (a bot asks on the PR). Changes to `.github/plugins/azure-skills/` must go upstream to microsoft/github-copilot-for-azure; this patch does not touch that folder.
- **Acceptance:** medium (about 50%). Most merges come from members and a sync bot; outside fixes are accepted but less often.

## Confirmed but better as an issue, or low value

4. **firebase/agent-skills:** `skills/firebase-data-connect-basics/SKILL.md` has `name: firebase-data-connect`; every other skill in the repo matches its folder, and the Agent Skills spec requires it. Renaming either side changes the invocation name and may affect their eval pipeline in firebase-tools, so open an **issue** and let maintainers choose. PRs need the Google CLA. Acceptance of an issue: likely; of a PR: uncertain.
5. **jezweb/claude-skills:** `plugins/frontend/skills/design-system/SKILL.md:180` says to follow "the `design-loop` skill's `references/site-template.md`", but `design-loop` has no `references/` folder. Low impact: the same step lists all six sections inline. Not worth a PR on its own.
6. **anthropics/skills** (`claude-api` description 1,068 > 1,024 characters) and **Yuan1z0825/nature-skills** (`name: researchwrite` in folder `nature-proposal-writer`): re-checked 2026-11-10, both still present. Recommendations from round 1 stand (issues, not PRs).

## Duplicates and rejections

- **microsoft/skills `microsoft-foundry` plugin:** all 10 entries in `.github/plugins/microsoft-foundry/skills/` are dangling symlinks to `../../azure-skills/skills/foundry-*`, which no longer exist, so the plugin installs with no working skills. **Already fixed in open PR #414** (by a Microsoft contributor, Aug 24), which replaces them with one link to the existing `microsoft-foundry` skill. Do not file. SkillPath Guard missed this before; it now reports these links (see Phase 4).
- **shanraisshan/claude-code-best-practice #283 vs #142:** see `docs/CONTRIBUTION_LEDGER.md`. #142 covers #283 completely.
- **anthropics/claude-plugins-official `m5-onboard`:** 14 missing `scripts/`/`references/` paths, but the skill says in its "Where the scripts live" section that they live in a clone of `moremas/build-with-claude` made by `/maker-setup`. Intentional.
- **anthropics/claude-cookbooks, alirezarezvani (`scripts/convert.sh`), pulumi (`scripts/upstream.sh`), hashicorp (`scripts/setup-winrm.ps1`), huggingface (`./scripts/train.py`):** paths in the user's project or the repo root, not the skill. Intentional.
- **plugin-dev `skill-development`, openai `skill-creator`, microsoft `skill-creator`, getsentry `claude-settings-audit`, dotnet `create-skill`:** example paths in guides about writing skills.
- **posthog/skills:** omnibus skills are auto-synced daily from the PostHog monorepo and context-mill ("do not edit"). The remaining dead links could not be traced to source files in either repo by folder name, so they are not reported. The 86 `NAME_INVALID` are generated names (underscores, dots) in generated folders; repo-specific design.
- **vercel-labs/agent-skills, better-auth/skills (name != folder):** consistent prefixing (`vercel-react-best-practices`), clearly deliberate.
- **neondatabase `score-eval`:** no description, but `disable-model-invocation: true` makes it a slash-command-only eval helper. Not worth reporting.
- **davila7/claude-code-templates (272 missing):** a large collection of copied skills; not triaged in depth. Fixes belong in the original sources.

## SkillPath Guard false positives found (fixed in Phase 4)

| Pattern | Example (repo) | Count removed |
|---|---|---|
| File in another skill named on the same or previous line | "Route to `eas-app-stores`; its `references/native-ios.md`" (expo), wshobson llm-finetuning, posthog, cloudflare | 47 |
| Placeholder cuts the path short | `scripts/train_<variant>_example.py` (huggingface) | 8 |
| Extensionless slash pair in prose | "repository scripts/CI commands" (dotnet), "assets/variants" (openai) | 16 |
| Extensionless name that resolves to one file | `import ... from './assets/card-builder'` (jezweb), `references/open-coding` (awesome-copilot) | 4 |

Across the 33 repositories `MISSING_REFERENCE` fell from 514 to 439 (-75). All 75 removals were reviewed; none was a real missing file. New true positives: 10 `SYMLINK_BROKEN` (the microsoft-foundry links). `CASE_MISMATCH` unchanged at 3.
