# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# 1.0.0 (2026-05-19)


### Bug Fixes

* **ci:** correct semantic-release plugin configuration ([4352377](https://github.com/rubix-studios-pty-ltd/payload-media/commit/435237737bc00a1370080284e237597184888e8b))
* **dep:** insertion of runtime deps with version bump. ([f4a157c](https://github.com/rubix-studios-pty-ltd/payload-media/commit/f4a157c73cc61dc1dc7eb42dff001a82ffcb29ac))
* **deps:** enforce patched upstream versions for CVE mitigation ([8696579](https://github.com/rubix-studios-pty-ltd/payload-media/commit/8696579a083615029e101f70412516b6643a1113))
* **deps:** update lru-cache, tempy, and undici to latest versions ([c58a977](https://github.com/rubix-studios-pty-ltd/payload-media/commit/c58a977e2edff899c2328e93c569d40ef7127011))
* force CVE-2026-23864 coverage. ([2de0c25](https://github.com/rubix-studios-pty-ltd/payload-media/commit/2de0c2529ca8e16e8d3fdcadcab8bc16c5f376b2))
* image first load undefined. ([721e329](https://github.com/rubix-studios-pty-ltd/payload-media/commit/721e3296f75163d8095a45e45389898f0fd8f8da))
* release pipeline and update packages ([2cf00c1](https://github.com/rubix-studios-pty-ltd/payload-media/commit/2cf00c1f3ed8232e12a2eeff7648fef9428d6840))
* **release:** raise minimum dependancies to ensure security ([b8d9ac0](https://github.com/rubix-studios-pty-ltd/payload-media/commit/b8d9ac032d525c21a2bba82e733bc85bec6a4c9f))
* **releaserc:** add releaseRules to commit-analyzer configuration ([0b2fa24](https://github.com/rubix-studios-pty-ltd/payload-media/commit/0b2fa24feeeeb89172029cc3d9be1ac1248111a9))
* **release:** update branch name from 'development' to 'dev' ([0a44ebc](https://github.com/rubix-studios-pty-ltd/payload-media/commit/0a44ebc17f75e3c8883add688a61c72540a43151))
* remove peerDependencies for payload ([a8c237e](https://github.com/rubix-studios-pty-ltd/payload-media/commit/a8c237e3d27e5c5ae4dde572834583ece34e83a9))
* **rlease:** trigger npm release ([20ad4a5](https://github.com/rubix-studios-pty-ltd/payload-media/commit/20ad4a58852625ed3e2461dcf398867c1613f8dc))
* **rlease:** trigger npm release different tag ([5a0ce72](https://github.com/rubix-studios-pty-ltd/payload-media/commit/5a0ce723c34c3b4aa5420017682e45e901db566c))
* **types:** remove unused color option from PexelsColours ([f95d85a](https://github.com/rubix-studios-pty-ltd/payload-media/commit/f95d85a1c436777631066060748a2b49f7396c35))
* **types:** remove unused license fields from OpenverseResult interface ([590390b](https://github.com/rubix-studios-pty-ltd/payload-media/commit/590390bcaf1c12b6a2a0758af5b2dd43085f6c06))
* update @payloadcms/ui and payload dependencies to latest versions ([ee6101d](https://github.com/rubix-studios-pty-ltd/payload-media/commit/ee6101d0e6f9043ffc0b550348570984c34114ca))
* update @types/react version to 19.2.10 and adjust package-lock entries ([a01d51d](https://github.com/rubix-studios-pty-ltd/payload-media/commit/a01d51d01024d46c25865186b86bbfa81efdf390))
* update babel parser and b4a versions in pnpm-lock.yaml; format fetchCache call in SearchImages component ([38b658e](https://github.com/rubix-studios-pty-ltd/payload-media/commit/38b658e1c65cb5e8ade89bc364639bcbd7a16580))
* update biome and rimraf dependencies, and bump package manager version ([8269bfc](https://github.com/rubix-studios-pty-ltd/payload-media/commit/8269bfcc36031544bed5edc0f377e224f0aabc23))
* update biome configuration to ignore specific directories and bump package versions ([f5f809d](https://github.com/rubix-studios-pty-ltd/payload-media/commit/f5f809dfadc34cbd66879fff26fcaec0bec7e778))
* update biome schema version and format package.json files array ([1d9be1e](https://github.com/rubix-studios-pty-ltd/payload-media/commit/1d9be1e70036b88bcfc1b9a49beb1326ed451f8b))
* update biome schema version and refactor search images component to use provider filters ([3aedaed](https://github.com/rubix-studios-pty-ltd/payload-media/commit/3aedaed266c6873f5b5cb5b86f97e32baf7d42be))
* update biome version and improve search image logic ([3c5f3db](https://github.com/rubix-studios-pty-ltd/payload-media/commit/3c5f3db8f2f53caa8a4dc1c46c7e62318f4455ce))
* update import paths to use correct casing for provider modules ([c871890](https://github.com/rubix-studios-pty-ltd/payload-media/commit/c871890fb3b5bc3ef09a130ab3eafce2eb92f967))
* update node type definition to version 25.9.0 in pnpm-lock.yaml ([682ccfc](https://github.com/rubix-studios-pty-ltd/payload-media/commit/682ccfcd4e1f254902051987f4726891fbee6960))


### Features

* expand gitignore coverage and update dependencies ([c7f543d](https://github.com/rubix-studios-pty-ltd/payload-media/commit/c7f543d77494649bbf4a0ef5faed0bcbb146c861))
* Refactor media search functionality and add support for video ([4d16f6e](https://github.com/rubix-studios-pty-ltd/payload-media/commit/4d16f6e96cc537a42d9e20b3bee0557e13fa51d9))
* **releaserc:** simplify commit analyzer configuration by removing release rules ([110c320](https://github.com/rubix-studios-pty-ltd/payload-media/commit/110c3207d951b64e32ea50717244082f43825b64))
* upgrade Payload CMS from v3.75.0 to v3.76.0 ([4417ecf](https://github.com/rubix-studios-pty-ltd/payload-media/commit/4417ecfd31f1a1b377340363e736dcc60506f988))

## [1.0.2](https://github.com/rubix-studios-pty-ltd/payload-images/compare/v1.0.1...v1.0.2) (2026-01-24)


### Bug Fixes

* **types:** remove unused color option from PexelsColours ([f95d85a](https://github.com/rubix-studios-pty-ltd/payload-images/commit/f95d85a1c436777631066060748a2b49f7396c35))
* **types:** remove unused license fields from OpenverseResult interface ([590390b](https://github.com/rubix-studios-pty-ltd/payload-images/commit/590390bcaf1c12b6a2a0758af5b2dd43085f6c06))

## [1.0.1](https://github.com/rubix-studios-pty-ltd/payload-images/compare/v1.0.0...v1.0.1) (2026-01-24)


### Bug Fixes

* **rlease:** trigger npm release different tag ([5a0ce72](https://github.com/rubix-studios-pty-ltd/payload-images/commit/5a0ce723c34c3b4aa5420017682e45e901db566c))

# 1.0.0 (2026-01-24)


### Bug Fixes

* **rlease:** trigger npm release ([20ad4a5](https://github.com/rubix-studios-pty-ltd/payload-images/commit/20ad4a58852625ed3e2461dcf398867c1613f8dc))
