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
- [x] GitHub Actions Node 20/22/24 × Linux/macOS/Windows green on release commit: [run 42578691493](https://github.com/ClarrieO5/skillpath-guard/actions/runs/42578691493)
- [x] [v0.1.0 GitHub prerelease](https://github.com/ClarrieO5/skillpath-guard/releases/tag/v0.1.0) created at tested commit `861a7fcb826e6f1483253df59da1dbdba97aea25`
- [ ] Independent human review and real-runtime validation (not required to label this release experimental; still outstanding)

## Repeatable maintainer procedure

1. Run `npm run verify` and `npm pack --dry-run` in a clean checkout.
2. Review `git diff --check`, licence, disclosure, and any report paths before committing.
3. Push source and wait for all nine quality jobs. Do not waive failures to publish.
4. Create GitHub tag `v0.1.0` at the tested commit and mark the release **pre-release**.
5. Include the validation command, actual CI link, known limitations, and links to research and impact log in release notes. GitHub automatically provides source archives.
6. Keep `private: true` until an npm name and publication decision have been verified. GitHub source releases do not require npm publication.

## Manual completion map

Days 1–2: setup, research, source development and regression work completed in this environment. Day 3: baseline experiments completed; live-runtime experiment explicitly untested. Day 4: all nine hosted matrix jobs passed. Day 5: documentation and local usability checks completed; independent trials outstanding. Day 6: issues/contribution policies reviewed; no new confirmed upstream bug, outreach or PR. Day 7: release preparation and honest evidence audit completed; experimental prerelease published after CI passed. The seven-day plan is not fully complete merely because the CLI works.

## npm publication (prepared, not done; needs the maintainer's decision)

The package is publish-ready apart from `private: true`, which is deliberate. The name `skillpath-guard` was unclaimed on 2026-11-10 (registry 404). To publish:

1. Decide that npm is worth maintaining (see `docs/ADOPTION_AUDIT_2026-11.md`: `npx github:...` already works without it).
2. On the release commit: `npm run verify`, then `npm pack --dry-run` and check that it lists only `src/`, README, LICENSE, SECURITY, `docs/CHANGELOG.md` and `package.json`.
3. Remove `"private": true` in the release PR (one line, reviewed like any other change).
4. With 2FA on your npm account: `npm publish --access public` from a clean checkout of the tag. `prepublishOnly` runs `npm run verify` first. Note: `npm publish --dry-run` does **not** fail on `private: true`, so a dry run is not evidence the flag works.
5. Check: `npx --yes skillpath-guard@<version> --version` in an empty directory.
6. Optional, later: configure npm trusted publishing (provenance) from a GitHub Actions workflow; check npm's current documentation first.

## GitHub Marketplace (prepared, not done)

Requirements read from the `github/docs` source on 2026-11-10: a public repository, a single `action.yml` at the root, a `name` that is not an existing Marketplace action, GitHub user/org or category; the owner accepts the Marketplace Developer Agreement and uses 2FA. `action.yml` now has `branding`. To list: open `action.yml` on GitHub, choose **Draft a release**, tick **Publish this Action to the GitHub Marketplace**, pick a primary category (Continuous integration or Code quality), and publish the release. Recommended only after the Action has run from a separate repository.

## v0.2.1 and later

1. Merge the release PR only after all nine `quality` jobs pass on it. They now include a check that the Action **fails** on `examples/broken`.
2. Make sure the tag in `.github/workflows/release-check.yml` matches the new version. Use lowercase `v` tags from now on (`v0.2.1`); `V0.2.0` was a one-off.
3. Create the release in the GitHub UI: tag `v0.2.1` on `main`, mark it **pre-release**, and paste in `docs/RELEASE_NOTES_v0.2.1.md`.
4. Publishing triggers `release-check`, which runs `uses: ClarrieO5/skillpath-guard@v0.2.1` exactly as a consumer would. If it fails, edit the release back to draft and fix forward. Never move a published tag.
5. Record both run links in the release notes and in `docs/VALIDATION.md`.
