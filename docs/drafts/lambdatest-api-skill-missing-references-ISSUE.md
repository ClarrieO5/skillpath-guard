<!-- Draft for LambdaTest/agent-skills. NOT submitted. Prepared 2026-11-11 against main 375e466.
ISSUE rather than PR: the referenced files never existed in history (git log --all finds no commit with these paths), so the fix is either new content (maintainer's call) or removing the pointers.
Submit after (or together with) the kanecli PR, not as a burst. Duplicate search: 18 PRs and 3 issues in the repo, none about this. -->

TITLE:
api-designer and popular-api-fetcher tell the agent to read reference files that don't exist

BODY:
Two api skills point the agent to `references/` files that are not in the repository:

- `api-skill/api-designer/SKILL.md:133`: "Read `references/domains.md` for pre-built resource lists per domain ..."
- `api-skill/api-designer/SKILL.md:135`: "Read `references/testmu_example.md` for generating API structure ..."
- `api-skill/popular-api-fetcher/SKILL.md:102`: "See `references/testmu-hyperexecute-api.md` for full specs ..."

Neither skill has a `references/` folder, and no commit in the history has ever contained these files. An agent following these instructions will look for the files and not find them.

Would you prefer to add the files, or should the pointers be removed? I can send a PR for the second option.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard) and checked by hand; prepared with an AI coding assistant (Claude Code).
