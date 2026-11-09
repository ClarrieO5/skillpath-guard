# v0.1.0 experimental release

## Scope

An offline Node.js CLI for SKILL.md local-resource checks, portability warnings, regression baselines, JSON/Markdown/text reports, and GitHub annotations. No runtime compatibility or adoption claims.

## Release gate

- [x] Supplied code reviewed; original nine tests run
- [x] Regression and CLI tests added, 50 local tests pass
- [x] Expected valid/broken/baseline exits verified
- [x] Ten public skill directories audited with source revision and licence checks
- [x] MIT licence and AI assistance disclosure retained
- [x] README, contribution templates, security scope and limitations provided
- [ ] GitHub Actions Node 20/22/24 × Linux/macOS/Windows green on release commit
- [ ] Tagged GitHub prerelease created from tested commit
- [ ] Independent human review and real-runtime validation (not required to label this release experimental; still outstanding)

## Repeatable maintainer procedure

1. Run `npm run verify` and `npm pack --dry-run` in a clean checkout.
2. Review `git diff --check`, licence, disclosure, and any report paths before committing.
3. Push source and wait for all nine quality jobs. Do not waive failures to publish.
4. Create GitHub tag `v0.1.0` at the tested commit and mark the release **pre-release**.
5. Include the validation command, actual CI link, known limitations, and links to research and impact log in release notes. GitHub automatically provides source archives.
6. Keep `private: true` until an npm name and publication decision have been verified. GitHub source releases do not require npm publication.

## Manual completion map

Days 1–2: setup, research, source development and regression work completed in this environment. Day 3: baseline experiments completed; live-runtime experiment explicitly untested. Day 4: workflow prepared; hosted run linked in validation evidence. Day 5: documentation and local usability checks completed; independent trials outstanding. Day 6: issues/contribution policies reviewed; no new confirmed upstream bug, outreach or PR. Day 7: release preparation and honest evidence audit completed; publication is conditional on CI. The seven-day plan is not fully complete merely because the CLI works.
