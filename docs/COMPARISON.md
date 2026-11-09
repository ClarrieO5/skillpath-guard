# Comparison with the Agent Skills reference validator

**Method and limits.** Installing third-party validators was denied by the permission classifier (three attempts across sessions) and was not bypassed. Both comparators were therefore assessed by **reading their source** (shallow clones, 2026-11-09), never by running them. Nothing below was measured on identical fixtures; "verified" means verified in source or in SkillPath Guard's own tests, "untested" means inferred or not examined. This is a code-reading comparison, not a benchmark.

Comparators: (1) `skills-ref`, the reference validator (`agentskills/agentskills`, `skills-ref/src/skills_ref/validator.py`); (2) `@vibe-agent-toolkit/agent-skills` v0.1.42 (`jdutton/vibe-agent-toolkit`, `packages/agent-skills/src/validators/`), a much larger toolkit that also builds and packages skills.


## Reference validator (`skills-ref`): verified in source

| Check | skills-ref | SkillPath Guard |
|---|---|---|
| name: length <= 64, lowercase, no leading/trailing/double hyphen, Unicode letters (NFKC), equals directory | Yes | Yes (Unicode since 0.2.0) |
| description non-empty, <= 1024 | Yes | Yes |
| `compatibility` <= 500 chars | Yes | Yes (since 0.2.0) |
| Allowed-field list | Yes | **No** |
| Real YAML parser | Yes | **No** (regex subset) |
| Referenced files exist, case, path/symlink escape, absolute paths | No | **Yes** |
| cwd-ambiguity warning, baselines, JSON, annotations | No | Yes |

## `@vibe-agent-toolkit/agent-skills`: error codes seen in source, behaviour untested

- Overlaps with us: broken markdown links (`LINK_INTEGRITY_BROKEN`, via a link graph that follows linked documents; we do not parse linked documents), name/description/frontmatter rules, name vs directory mismatch.
- Goes beyond us: description style checks, size/file-count limits, unreferenced files, non-portable command/capability detection, packaging and marketplace/plugin validation, `SKILL_IMPLICIT_REFERENCE` (info) for bare paths.
- We could not confirm from source whether it detects filename-case mismatches, symlink escapes or Windows absolute paths, nor how it treats bare `scripts/x.py` mentions beyond the info-level code above. Untested.

## Summary
- **Better (verified for skills-ref; plausible for the other, untested):** case, symlink, absolute-path and path-escape detection, bare-path dependency detection, baseline gating, zero dependencies.
- **Equal:** name, description and compatibility rules versus skills-ref.
- **Worse:** YAML fidelity, allowed-field checks, following links into linked documents, packaging/size/style checks.
- Recommended: use `skills-ref` for frontmatter; use SkillPath Guard for resource-path portability.
