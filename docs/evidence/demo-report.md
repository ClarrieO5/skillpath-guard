# SkillPath Guard report

Scanned 1 skill(s); 1 errors, 1 warnings.

| Severity | Rule | Location | Explanation |
|---|---|---|---|
| warning | AMBIGUOUS_CWD | `demo-skill/SKILL.md:8` | Instruction uses a relative resource path (references/guide.md); some agents resolve paths from the workspace instead of the skill directory. Verify with the target runtime. |
| error | MISSING_REFERENCE | `demo-skill/SKILL.md:9` | Referenced file does not exist: references/not-there.md |

Note: static checks do not replace actual tests in each agent runtime.
