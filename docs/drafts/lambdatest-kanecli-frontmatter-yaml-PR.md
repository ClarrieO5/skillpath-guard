<!-- Draft for LambdaTest/agent-skills. NOT submitted. Prepared 2026-11-11 against upstream main 375e466.
Patch: docs/patches/lambdatest-kanecli-frontmatter-yaml.patch (1 file: the description line becomes a folded block scalar; parsed text identical).
After `git am`, run `git commit --amend --reset-author --no-edit`. No PR template or CLA. CONTRIBUTING asks to run `python3 scripts/validate_skills.py`;
it was NOT run (session permission system blocks running another repo's scripts). I read it: it checks `^description:` by regex, which still matches.
Merged history includes AI-co-authored commits (f86b2ff), so AI-assisted PRs are not prohibited.
Duplicate search 2026-11-11: the repo has 18 PRs and 3 issues in total (all listed); none concerns kanecli-skill or YAML.
Optional follow-up for the maintainer, not in this patch: the description is 1066 characters (spec maximum 1024); kanecli-skill is also missing from skills_index.json.
Re-verified 2026-11-11 (session 10): upstream HEAD still 375e466; 18 PRs / 3 issues, none new, none on kanecli or YAML; `git apply --check` clean.
Before/after reproduced: PyYAML 6, js-yaml 4.1.0, yaml 2.6.1 and skills-ref 0.1.1 fail before and parse after; parsed description identical (1,066 chars);
skills-ref after: only the length error. validate_skills.py still not run (blocked); read in full: the patched file still matches `^description:` and is 398 lines (limit 500).
Outside PRs are merged here (17 of 18 PRs merged, e.g. #20 from an outside contributor). -->

TITLE:
kanecli-skill: make the SKILL.md frontmatter valid YAML

BODY:
The `description` in `kanecli-skill/SKILL.md` is an unquoted single-line value that contains `target): locally`. In YAML, a colon followed by a space inside a plain value starts a nested mapping, so the whole frontmatter fails to parse:

- PyYAML 6: `mapping values are not allowed here`
- js-yaml 4.1.0: `bad indentation of a mapping entry`
- yaml 2.6.1: `Nested mappings are not allowed in compact mappings`
- `skills-ref validate` (the Agent Skills reference validator): `Invalid YAML in frontmatter: mapping values are not allowed here`

All four point at column 754 of the `description` line (line 3 of the file), the `): ` after "default target".

Any tool that reads the frontmatter with a standard YAML parser gets an error instead of `name`/`description`, so it may skip the skill or fail to list it.

This PR moves the same text into a folded block scalar (`description: >-`). No wording changes: all three parsers now load it, and the parsed description is byte-for-byte the same as before.

One more thing I noticed, which this PR does not change: the description is 1,066 characters, and the [Agent Skills specification](https://agentskills.io/specification) allows at most 1,024, so `skills-ref` still reports the length. Shortening it is a wording decision, so I left it to you. I'm happy to add a trimmed version if you'd like.

Found with [SkillPath Guard](https://github.com/ClarrieO5/skillpath-guard), an offline checker for skills, and prepared with an AI coding assistant (Claude Code). I reviewed the diff before submitting.
