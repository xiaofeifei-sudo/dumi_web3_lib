---
nav: changelog
group:
  title: 其他
  order: 4
---

# 如何添加 Changelog

## 什么变更需要 Changelog

修改了 `packages` 下的文件

- pelican-web3-lib-assets
- pelican-web3-lib-common
- pelican-web3-lib-icons
- pelican-web3-lib-solana
- pelican-web3-lib-wagmi
- pelican-web3-lib

## 如何生成 Changelog

1. 首先需要执行命令:

<NormalCommand command="changeset"></NormalCommand>

```
MacBook-Pro pelican-web3-lib % pnpm changeset

> pelican-web3-lib-docs@0.0.0 changeset pelican-web3-lib
> changeset
```

2. 通过空格选中修改的包，然后输入回车确认。

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

3. 此时，我们应该通过回车跳过，一般情况下的 bugfix, 我们都是选择最后一项`patch` 版本，有新版本特性的我们才会选择`minor`。

```
🦋  Which packages should have a major bump? · No items were selected
🦋  Which packages should have a minor bump? · No items were selected
🦋  The following packages will be patch bumped:
🦋  pelican-web3-lib@1.9.0
🦋  Please enter a summary for this change (this will be in the changelogs).
🦋    (submit empty line to open external editor)
🦋  Summary ›
```

4. 最后一步，我们在 Summary 中提交符合 [Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) 规范的信息。

```
🦋  Summary › feat: support more icons
```
