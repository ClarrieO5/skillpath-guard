# External contributions: investigation results (nothing has been submitted)

Re-checked 2026-11-09 against fresh shallow clones, re-scanning with SkillPath Guard `main` (a411edd). Only 1 of 10 repositories had new commits since the first scan (`career-ops`, `marketingskills`); the rest were unchanged.

## Ranking (likelihood of acceptance, highest first)

### 1. shanraisshan/claude-code-best-practice: remove 9 dead links (PR) - confirmed
- **Problem:** `.claude/skills/agent-browser/SKILL.md` lines 194-217 link to `references/*.md` (6 files) and `templates/*.sh` (3 files). The skill folder contains only `SKILL.md`, and no `references/` or `templates/` folder exists anywhere in the repo (`git ls-files` at 1a045f7).
- **Cause (checked):** this skill is a copy of `vercel-labs/agent-browser`'s skill; upstream's current `SKILL.md` is a 50-line stub that tells agents to run `agent-browser skills get core` and no longer ships those folders. The copy kept links that no longer resolve.
- **Reproduce:** `node src/cli.mjs scan <clone>/.claude/skills/agent-browser` reports 9 `MISSING_REFERENCE` errors; after the patch it reports 0 errors, 0 warnings.
- **Patch:** `docs/patches-claude-code-best-practice-agent-browser.diff` (25 lines deleted: the "Deep-Dive Documentation" and "Ready-to-Use Templates" sections). Alternative the maintainer might prefer: refresh the whole file from upstream.
- **Guidelines:** the repo has no CONTRIBUTING.md or PR template (README/CLAUDE.md describe usage, not contributions). Use a normal fork-and-PR; keep it one small commit. The repo updates daily, so rebase if asked.
- **Test:** no test suite for skill docs; the check is the scan above. Not run through the maintainer's CI (none seen).

### 2. Yuan1z0825/nature-skills: skill `name` does not match its folder (issue first)
- **Problem:** `skills/nature-proposal-writer/SKILL.md` has `name: researchwrite`; the spec (and `skills-ref`) require the name to equal the directory name. Verified in file line 2; SkillPath Guard reports `NAME_INVALID`.
- **Why issue, not PR:** the name is used as the invocation name elsewhere (`agents/openai.yaml` default prompt `$researchwrite`, `references/review-critique-methodology.md`), so the right fix (rename folder or rename skill) is the maintainers' call and touches several files.
- **Guidelines:** no CONTRIBUTING.md; has `.github/workflows` and `tests/`. Check their CI before proposing a PR.

### 3. anthropics/skills: `claude-api` description is 1,068 characters (issue)
- **Problem:** parsed with a real YAML parser (PyYAML), `skills/claude-api/SKILL.md` frontmatter `description` is 1,068 characters; the Agent Skills spec limit is 1,024 (https://agentskills.io/specification, linked from the repo's `spec/`; I did not re-read the spec text this session, only the reference validator source, which enforces 1,024).
- **Why issue, not PR:** the description is trigger text that Anthropic tunes deliberately and the repo has no CONTRIBUTING guide or PR template, so acceptance of an external text edit is uncertain. An issue with the measurement is low-risk.

## Checked and rejected (not bugs, or not ours to fix)
- **Imbad0202/academic-research-skills:** `scripts/*.py` references in sub-skills are repo-root commands (the files exist at the root). Design choice, not a defect. (Their CONTRIBUTING.md accepts fork-and-PR; "Bug and drift fixes" need maintainer review.)
- **open-design (14 SKILL.md files without frontmatter), marketingskills / nature-skills / superpowers (`../` sibling links), career-ops (symlinked SKILL.md):** plausible portability concerns but repo-specific design decisions; ask, don't assert.
- **blader/humanizer `NAME_INVALID`:** an artifact of my clone folder name (`blader__humanizer`), not a bug in that repo. Scanning a repo-root skill from a differently named folder produces this false alarm; worth a SkillPath Guard note. (Done: the message now says so when the skill is at the scan root.)
- **K-Dense `bulk-rnaseq`, `generate-image`, `[text](url)` placeholders:** our false positives (already fixed).
- **ECC `postgres-patterns` "Supabase" target:** the flagged line is the YAML `---`; likely an artifact of line mapping in a translated file. Not investigated further.

## Beginner-friendly submission steps (do these only when you decide to)
Candidate 1 (pull request):
1. Open https://github.com/shanraisshan/claude-code-best-practice and click **Fork** (top right), then **Create fork**.
2. In your fork open `.claude/skills/agent-browser/SKILL.md`, click the pencil icon (Edit).
3. Delete everything from the line `## Deep-Dive Documentation` to the end of the file (the patch file shows exactly which 25 lines).
4. Click **Commit changes**, choose **Create a new branch**, name it `fix-agent-browser-broken-links`, then **Propose changes**.
5. Click **Create pull request**. Suggested title: `Remove dead links to references/ and templates/ in agent-browser skill`.
6. Suggested description (plain facts):
   > `.claude/skills/agent-browser/SKILL.md` links to 6 files under `references/` and 3 under `templates/`, but neither folder exists in the repo. The upstream skill (vercel-labs/agent-browser) is now a short stub pointing at `agent-browser skills get core`. This PR removes the two sections whose links cannot resolve. Found with SkillPath Guard (`node src/cli.mjs scan .claude/skills/agent-browser`). Happy to refresh the file from upstream instead if you prefer.

Candidates 2 and 3 (issues): on the repository's **Issues** tab click **New issue**; use the facts above (file, line, what the spec requires, how you measured it) and offer a PR if they want one.

## Honest framing for eligibility
Merged pull requests into other people's repositories count toward the programme only in quantity (the stated threshold is 100 in 12 months) and quality; three small fixes are a start, not a qualification. Do not file low-value changes to increase counts.
