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

This initial release was substantially developed with Codex. Automated checks are not a substitute for human review. Do not claim the maintainer has reviewed generated code until that review actually happens. Changes should have a concrete use case and minimal reproduction; update the known-limitations section when parser scope changes. Run `npm run verify` for the release gate. Do not include external corpus copies or private scan reports in patches.
