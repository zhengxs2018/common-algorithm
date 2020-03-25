# @zhengxs/common-algorithm

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> ⚠️ 注意: 代码使用了 `@babel/plugin-external-helpers` 插件，剔除了 `babel` 助手函数

常用算法，支持 nodejs 与浏览器

## 安装

`npm install @zhengxs/common-algorithm`

## 启动工程

推荐使用 [yarn][yarn] 或 [cnpm][cnpm] 来管理依赖。

``` bash
# 安装依赖 or yarn install
$ npm install

# 启动开发模块，用于和 npm link 配合
$ npm run dev

# 构建源码
$ npm run build

# 构建后生成分析报告
$ npm run build --analyse

# 生成 api 文档
$ npm run build:docs
```

更多 `npm version` 的命令可使用 `npm version --help` 查看

## 运行单元测试

``` bash
# 单元测试
$ npm test

# 生成测试报告
$ npm run report
```

## 发布版本

```shell
# 更新版本
$ npm version <newversion|major|minor|patch>

# 发布代码
$ npm publish
```

## 更新日志

See [CHANGELOG.md](./CHANGELOG.md)

## 贡献

See [CONTRIBUTING.md](./CONTRIBUTING.md)

[yarn]: https://yarnpkg.com/lang/zh-hans/
[cnpm]: https://npm.taobao.org/
[nodejs]: https://nodejs.org
[rollupjs]: https://rollupjs.org
