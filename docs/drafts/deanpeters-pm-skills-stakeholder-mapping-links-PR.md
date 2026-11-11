<!-- Draft for deanpeters/Product-Manager-Skills. NOT submitted. Prepared 2026-11-11 against upstream main cfcb697 (git ls-remote HEAD = cfcb697 on 2026-11-11).
Patch: docs/patches/deanpeters-pm-skills-stakeholder-mapping-links.patch (3 lines, 3 files). After `git am`, run
`git commit --amend --reset-author --no-edit` so the commit carries your own git identity.
No PR template in the repo. AGENTS.md: imperative commit subject; PR has a short summary, linked issues, and the skill type.
dist/*.zip contain the same links; AGENTS.md says not to edit dist/ by hand, so the PR leaves them for the maintainer's release build.
Their validators (scripts/validate-skills.sh, check-dist-freshness.py, test-library.sh) were NOT run: the session permission system blocks running another repo's scripts. CI (build-release.yml) runs them on the PR.
Duplicate search 2026-11-11 (issues and PRs, open and closed): "stakeholder-map", "broken link", "eol" -> no hits about this. Copy everything below TITLE/BODY.
Re-verified 2026-11-11 (session 10): upstream HEAD still cfcb697; 13 PRs, none new; no issue or PR mentions stakeholder-map; `git apply --check` clean.
After the patch: 29/29 `../<skill>/SKILL.md` links in the three files resolve; `skills/stakeholder-map` has no history (`git log --all` empty).
Their CI (build-release.yml, runs on pull_request): validate-skills.sh -> check-library-drift.py checks only README/CLAUDE links and marketplace.json;
check-dist-freshness.py (read in full) compares skill membership only, not zip contents, so leaving dist/ untouched should not fail it. Scripts not run (blocked).
Acceptance risk: 5 of 13 PRs merged, last merge 2026-07-16; small fix PRs #17 and #21 were closed unmerged. -->

TITLE:
Fix links to stakeholder-mapping in the EOL skills

BODY:
Three EOL skills link to `../stakeholder-map/SKILL.md`, but that skill does not exist. The skill they describe ("general power/interest mapping") is `stakeholder-mapping`. This PR points the three links at it.

- `skills/eol-process/SKILL.md`
- `skills/eol-readiness-advisor/SKILL.md`
- `skills/eol-stakeholder-sequence/SKILL.md`

Skill type: component (cross-reference fix only; no content change).

How I checked:
- `skills/stakeholder-map/` is not in the repo or its history. These three lines, added in d025768 (Lifecycle & EOL suite), are the only places the name appears. `skills/stakeholder-identification/SKILL.md` already links to `../stakeholder-mapping/SKILL.md`.
- After the change, every `../<skill>/SKILL.md` link in the three files resolves (29 links checked).
- I did not rebuild `dist/`: AGENTS.md says not to edit it by hand, so the zips will pick this up in your next release build.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard), an offline checker for skills, and prepared with an AI coding assistant (Claude Code). I reviewed the diff before submitting.
