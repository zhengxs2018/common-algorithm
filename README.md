# @zhengxs/common-algorithm

[![lang](https://img.shields.io/badge/lang-typescript-informational)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm version](https://badge.fury.io/js/%40zhengxs%2Fcommon-algorithm.svg)](https://www.npmjs.com/package/%40zhengxs%2Fcommon-algorithm)
[![Downloads](https://img.shields.io/npm/dm/%40zhengxs%2Fcommon-algorithm.svg)](https://www.npmjs.com/package/%40zhengxs%2Fcommon-algorithm)

常用算法，支持 nodejs 与浏览器，使用 TypeScript 重构

## 安装

`npm install @zhengxs/common-algorithm --save`

## 启动工程

推荐使用 [yarn][yarn] 或 [cnpm][cnpm] 来管理依赖。

``` bash
# 安装依赖
$ npm install

# 启动文件监听，用于和 npm link 配合
$ npm run watch

# 构建源码
$ npm run build

# 构建后生成分析报告
# 生成的文件在 dist/bundle-analyzer-report.html
$ npm run build --analyse

# 生成 api 文档
$ npm run doc
```

更多 `npm version` 的命令可使用 `npm version --help` 查看

## 运行单元测试

``` bash
# 单元测试
$ npm test

# 生成测试覆盖率报告
$ npm run cov
```

## 发布版本

```shell
# 更新版本
$ npm version <newversion|major|minor|patch>

# 发布代码
$ npm publish
```

[yarn]: https://yarnpkg.com/lang/zh-hans/
[cnpm]: https://npm.taobao.org/
[nodejs]: https://nodejs.org
[rollupjs]: https://rollupjs.org
