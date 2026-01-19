---
nav: changelog
group:
  title: Others
  order: 4
---

# How to add Changelog

## What changes need a Changelog?

Modified files under `packages`

- pelican-web3-lib-assets
- pelican-web3-lib-common
- pelican-web3-lib-icons
- pelican-web3-lib-solana
- pelican-web3-lib-wagmi
- pelican-web3-lib

## How to generate changelog

1. First of all, you need to run the command:

<NormalCommand command="changeset"></NormalCommand>

```
MacBook-Pro pelican-web3-lib % pnpm changeset

> pelican-web3-lib-docs@0.0.0 changeset pelican-web3-lib
> changeset
```

2. Select the modified package by space and press enter to confirm。

```
🦋  Which packages would you like to include? …
◉ changed packages
  ◉ pelican-web3-lib
◯ unchanged packages
  ◯ pelican-web3-lib-assets
  ◯ pelican-web3-lib-common
  ◯ pelican-web3-lib-icons
  ◯ pelican-web3-lib-solana
  ◯ pelican-web3-lib-wagmi
```

```
🦋  Which packages would you like to include? · pelican-web3-lib
🦋  Which packages should have a major bump? …
◯ all packages
  ◯ pelican-web3-lib@1.9.0
```

3. At this point, we should skip it with a carriage return. For bugfixes in general, we select the last `patch` version, and we select `minor` for newer features.。

```
🦋  Which packages should have a major bump? · No items were selected
🦋  Which packages should have a minor bump? · No items were selected
🦋  The following packages will be patch bumped:
🦋  pelican-web3-lib@1.9.0
🦋  Please enter a summary for this change (this will be in the changelogs).
🦋    (submit empty line to open external editor)
🦋  Summary ›
```

4. As a final step, we submit message in the `Summary` that conforms to [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

```
🦋  Summary › feat: support more icons
```
