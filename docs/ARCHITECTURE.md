# Architecture

- `src/cli.mjs`: validate flags, scan, compare baseline, render reports, choose exit status. Annotations go to stderr.
- `src/core.mjs`: discover skills without traversing directory symlinks; read common metadata; resolve references relative to each skill; inspect existence, case, and realpath containment; sort diagnostics; compare baselines.
- `src/references.mjs`: extract a documented Markdown subset and bare resource paths; skip URLs and dynamic expressions without fetching or evaluating them.
- `tests/`: original unit tests, regression fixtures, and spawned-process CLI tests. Temporary fixtures are removed after each test.
- `scripts/verify.mjs`: portable release gate checking the suite plus expected success, intentional failure, and baseline behaviour.
- `scripts/audit-corpus.mjs`: repeat the ten-skill static research scan on a separate downloaded repository; does not execute skills.

Flow: discover → parse → extract → resolve → inspect → diagnose → compare → render.

Finding fields: `rule`, `severity`, `file` (relative to scan root), `line` (1-based), `message`, `target`, `skill`. JSON also contains `tool`, `version`, `root`, `summary`, `skills`, and `limitations`. This experimental schema may change; regenerate reviewed baselines when upgrading.
