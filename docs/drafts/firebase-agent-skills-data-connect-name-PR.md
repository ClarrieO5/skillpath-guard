<!-- Draft for firebase/agent-skills. NOT submitted. Prepared 2026-11-10 against upstream main 99954a3.
Patch: docs/patches/firebase-agent-skills-data-connect-name.patch (applies cleanly to 99954a3).
Target branch: main (CONTRIBUTING: incremental improvements to an existing skill go to main).
Before opening: sign the Google CLA (https://cla.developers.google.com/). The CLA check matches the commit author email,
so after `git am`, run `git commit --amend --reset-author --no-edit` if the email in the patch is not your CLA email.
Re-verified 2026-11-10 (fourth session): upstream main still 99954a3, `next` (7af7804) has the same name, open PRs #141, #144, #160 and #207 all keep `name: firebase-data-connect`; no issue reports it.
The repository has no PR template. Copy everything below the TITLE/BODY markers; do not paste this comment. -->

TITLE:
fix(data-connect): match skill name to its folder (firebase-data-connect-basics)

BODY:
`skills/firebase-data-connect-basics/SKILL.md` declares `name: firebase-data-connect`. This one-line PR changes it to `firebase-data-connect-basics`, so it matches the folder.

Why:
- The [Agent Skills specification](https://agentskills.io/specification) requires `name` to match the parent directory, and strict validators reject the mismatch.
- It is the only one of the 14 skills in this repo whose name differs from its folder. #93 fixed the same mismatch for `firebase-security-rules-auditor` and `firebase-ai-logic-basics` the same way, by changing `name:` to the folder name.
- firebase-tools already uses the folder name. The Data Connect MCP tool descriptions (`src/mcp/tools/dataconnect/compile.ts` and `execute.ts`) tell agents to follow "the `firebase-data-connect-basics` skill", but no installed skill currently has that name.

No content changes. I checked that the old name does not appear anywhere else in this repo (`next` has the same mismatch, so the next sync will need the same line).

Checks run locally:
- `mdformat --wrap 80 --check` (mdformat 1.0.0 with the gfm and frontmatter plugins, the same command `scripts/format.sh --check` runs) passes on the edited file.
- The reference validator `skills-ref` (0.1.1): before, `Directory name 'firebase-data-connect-basics' must match skill name 'firebase-data-connect'`; after, `Valid skill`.

One side effect to be aware of: clients that invoke skills by name (for example a `/firebase-data-connect` slash command) will see the new name, `firebase-data-connect-basics`.

If you would rather rename the folder to `firebase-data-connect` instead, I'm happy to change the PR. I picked the name change because it matches #93 and the firebase-tools references.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard), an offline checker for skills, and prepared with an AI coding assistant (Claude Code). I reviewed the diff before submitting.
