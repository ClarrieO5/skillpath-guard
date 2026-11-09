# Comparison with the Agent Skills reference validator

**Limitation:** my environment blocked installing third-party validators, so only one comparator was assessed, and by **reading its source** (`agentskills/agentskills`, `skills-ref/src/skills_ref/validator.py`, cloned 2026-11-09), not by running it on identical fixtures. A second comparator (e.g. the npm package `@vibe-agent-toolkit/agent-skills`) was not evaluated. Treat the table as a code-reading comparison, not a benchmark.

| Check | skills-ref (reference) | SkillPath Guard |
|---|---|---|
| name: length <= 64, lowercase, no leading/trailing/double hyphen | Yes | Yes |
| name: Unicode letters allowed (NFKC) | Yes | **Was ASCII-only (stricter, a false-positive risk); fixed in this PR** |
| name must equal directory | Yes | Yes |
| description non-empty, <= 1024 | Yes | Yes |
| `compatibility` <= 500 chars, allowed-field list | Yes | **No (worse)** |
| Real YAML parsing | Yes (strictyaml) | **No: regex subset (worse)** |
| Referenced files exist (links, bare paths) | No | **Yes (the tool's purpose)** |
| Case mismatch, path escape, symlink escape, absolute paths | No | **Yes** |
| Cross-platform `cwd` ambiguity warning | No | Yes (heuristic) |
| Baselines, JSON, GitHub annotations | No | Yes |
| Spec-correct frontmatter edge cases | Better | Worse |

Summary: **better** at resource-path/portability checks (the reference tool has none); **equal** on name and description rules after this PR; **worse** on YAML fidelity and `compatibility`/allowed-fields checks. Recommended use: run both.
