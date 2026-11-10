<!-- Draft for firebase/agent-skills. NOT submitted. Prepared 2026-11-10 against upstream main 99954a3.
Patch: docs/patches/firebase-agent-skills-data-connect-name.patch (applies cleanly to 99954a3).
Target branch: main (CONTRIBUTING: incremental improvements to an existing skill go to main).
Before opening: sign the Google CLA (https://cla.developers.google.com/). The CLA check matches the commit author email,
so after `git am`, run `git commit --amend --reset-author --no-edit` if the email in the patch is not your CLA email.
The repository has no PR template. Copy everything below the TITLE/BODY markers; do not paste this comment. -->

TITLE:
fix(data-connect): match skill name to its folder (firebase-data-connect-basics)

BODY:
`skills/firebase-data-connect-basics/SKILL.md` declares `name: firebase-data-connect`. This one-line PR changes it to `firebase-data-connect-basics`, so it matches the folder.

Why:
- The [Agent Skills specification](https://agentskills.io/specification) requires `name` to match the parent directory, and strict validators reject the mismatch.
- It is the only one of the 14 skills in this repo whose name differs from its folder. #93 fixed the same mismatch for `firebase-security-rules-auditor` and `firebase-ai-logic-basics` the same way, by changing `name:` to the folder name.
- firebase-tools already uses the folder name. The Data Connect MCP tool descriptions (`src/mcp/tools/dataconnect/compile.ts` and `execute.ts`) tell agents to follow "the `firebase-data-connect-basics` skill", but no installed skill currently has that name.

No content changes. I checked that the old name does not appear anywhere else in this repo. I did not run `scripts/format.sh --check` locally; the change is inside the YAML frontmatter.

If you would rather rename the folder to `firebase-data-connect` instead, I'm happy to change the PR. I picked the name change because it matches #93 and the firebase-tools references.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard), an offline checker for skills, and prepared with an AI coding assistant (Claude Code). I reviewed the diff before submitting.
