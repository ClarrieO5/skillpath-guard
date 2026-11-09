# Security scope

SkillPath Guard reads SKILL.md files and inspects local filesystem metadata. It does not execute skill scripts or make network requests. It is not a sandbox, malware scanner, or full YAML/Markdown validator. Run it on a stable checkout using ordinary account permissions; do not run it elevated against an attacker-controlled, concurrently changing filesystem. Symlink checks do not protect against time-of-check/time-of-use races.

Only the latest experimental version is maintained. For a sensitive report, use GitHub's private vulnerability reporting if enabled; otherwise contact the repository owner through an existing private channel. Do not publish credentials or exploit details involving private data in an issue. Public non-sensitive reproductions can use the bug template.
