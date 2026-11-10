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
6. (v0.3.0 and earlier kept `private: true`; see "npm publication" below.) GitHub source releases do not require npm publication.

## Manual completion map

Days 1–2: setup, research, source development and regression work completed in this environment. Day 3: baseline experiments completed; live-runtime experiment explicitly untested. Day 4: all nine hosted matrix jobs passed. Day 5: documentation and local usability checks completed; independent trials outstanding. Day 6: issues/contribution policies reviewed; no new confirmed upstream bug, outreach or PR. Day 7: release preparation and honest evidence audit completed; experimental prerelease published after CI passed. The seven-day plan is not fully complete merely because the CLI works.

## npm publication (prepared, not done; needs the maintainer's decision)

Audit, 2026-11-10 (details in `docs/VALIDATION.md`): the name `skillpath-guard` and the near variants `skillpathguard`, `skillpath`, `skill-path-guard`, `skillpath_guard` are unclaimed (registry 404). The tarball has 8 files / 19 kB, no dependencies, no install-time scripts, nothing from `docs/drafts` or `docs/patches`. A clean `npm install <tarball>` works. `npm publish --dry-run` passes (and runs `prepublishOnly` = `npm run verify`). Not verifiable from a session: your npm account, 2FA, and rights to the name.

**Why 0.3.1.** The `v0.3.0` tag contains `"private": true`, so npm refuses it. The release PR bumps to `0.3.1` (`package.json`, `src/cli.mjs` x2, `src/core.mjs`, `tests/cli.test.mjs`, `release-check.yml`). The README on that PR already shows the npm install line, because the README ships inside the tarball and is what npm users read. **So merge the release PR only when you are ready to publish within the hour**; until `npm publish` succeeds, the GitHub README claims an npm package that does not exist yet.

### Authentication and provenance (npm docs read 2026-11-10)

- **Manual publish (recommended for the first version):** an npm account with 2FA, `npm login`, `npm publish` from a clean checkout of the tag. No provenance attestation (provenance needs a cloud CI runner). Simple and fully under your control.
- **Provenance:** `npm publish --provenance` works only from GitHub Actions (GitHub-hosted runner, `permissions: id-token: write`) and `package.json` `repository` must match the repo (it does: `git+https://github.com/ClarrieO5/skillpath-guard.git`). A first publish this way needs an npm automation/granular token stored as a repository secret. A dispatch-only template is in `docs/npm-publish.workflow.example.yml` (**untested**, not in `.github/workflows`).
- **Trusted publishing (no long-lived token, provenance automatic):** configured on npmjs.com under the package's settings, so the package must already exist. Needs npm CLI >= 11.5.1 and Node >= 22.14 in the workflow. Plan: publish 0.3.1 manually, then set up a trusted publisher for 0.3.2 onward.

### Steps (maintainer)

1. Merge the release PR (see above), then create release/tag `v0.3.1` (pre-release) with `docs/RELEASE_NOTES_v0.3.1.md` as the body. `release-check` must go green (it tests the Action, not npm).
2. Clean checkout of the tag: `git clone --depth 1 --branch v0.3.1 https://github.com/ClarrieO5/skillpath-guard.git && cd skillpath-guard`. Run `npm run verify` and `npm pack --dry-run` (expect the 8 files).
3. `npm login` (2FA), then `npm publish`. A version can never be reused and `npm unpublish` is limited, so publish only from the tag.
4. Check in an empty directory: `npx --yes skillpath-guard@0.3.1 --version` prints `0.3.1`, and open https://www.npmjs.com/package/skillpath-guard.
5. Record the result in `docs/VALIDATION.md` and `docs/STATUS.md` (a docs-only PR).
6. If step 3 fails or you decide not to publish: revert the README install lines (the release PR's README hunk) so GitHub does not mention npm.

## GitHub Marketplace (prepared, not done)

Requirements read from the `github/docs` source on 2026-11-10: a public repository, a single `action.yml` at the root, a `name` that is not an existing Marketplace action, GitHub user/org or category; the owner accepts the Marketplace Developer Agreement and uses 2FA. `action.yml` now has `branding`. To list: open `action.yml` on GitHub, choose **Draft a release**, tick **Publish this Action to the GitHub Marketplace**, pick a primary category (Continuous integration or Code quality), and publish the release. Recommended only after the Action has run from a separate repository.

## v0.2.1 and later

1. Merge the release PR only after all nine `quality` jobs pass on it. They now include a check that the Action **fails** on `examples/broken`.
2. Make sure the tag in `.github/workflows/release-check.yml` matches the new version. Use lowercase `v` tags from now on (`v0.2.1`); `V0.2.0` was a one-off.
3. Create the release in the GitHub UI: tag `v0.2.1` on `main`, mark it **pre-release**, and paste in `docs/RELEASE_NOTES_v0.2.1.md`.
4. Publishing triggers `release-check`, which runs `uses: ClarrieO5/skillpath-guard@v0.2.1` exactly as a consumer would. If it fails, edit the release back to draft and fix forward. Never move a published tag.
5. Record both run links in the release notes and in `docs/VALIDATION.md`.
