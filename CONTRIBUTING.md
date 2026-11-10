# Contributing

Thank you for helping. Please read this before filing issues or pull requests.

1. Search open issues and existing pull requests first.
2. For a bug report, include an **original or publicly shareable** minimal skill directory, CLI command, expected result, actual result, OS and Node version.
3. Do not submit private user prompts, tokens, API keys, or confidential skills.
4. For a code change, add a test that fails before your fix and passes after it.
5. Run `npm test` and `node src/cli.mjs scan examples/valid`.
6. Open a focused PR and explain the user problem solved. A human maintainer will review it.
7. If AI assisted, disclose its role and personally verify every proposed change.

Please do not mass-submit low-quality PRs or inflate metrics.

## Current project status

This project was substantially developed with AI assistance (Codex, then Claude Code). Automated checks are not a substitute for human review. Do not claim the maintainer has reviewed generated code until that review actually happens. Changes should have a concrete use case and minimal reproduction; update the known-limitations section when parser scope changes. Run `npm run verify` for the release gate. Do not include external corpus copies or private scan reports in patches.

## Development quick start
- Requires Node.js 20+. No dependencies to install.
- `npm run verify` runs the tests, the example scans, JSON output and the baseline gate; run it before opening a PR.
- Bug reports are most useful with the exact Markdown line, the skill folder layout, and the output of `node src/cli.mjs scan <dir> --format json`.
- Add a regression test in `tests/regressions.test.mjs` for every behaviour change (use the `fixture()` helper). A false-positive fix must also keep a test showing the real case is still detected.
- Rules live in `src/core.mjs`; reference extraction is in `src/references.mjs`. Keep changes small; this is a heuristic Markdown subset, not a CommonMark parser.
- Do not add runtime dependencies, network access or telemetry.
