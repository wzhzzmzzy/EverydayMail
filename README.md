# 每日早安邮件 EverydayMail@TypeScript

闲的无聊，整了个每日早安邮件定时脚本。使用它，可以每天定时发送早安邮件哦。

出于熟悉 TS 的目的，基本使用 TypeScript 编写。总入口是`main,js`，实际入口是`src/index.ts`。

## 使用方式

1. 准备

```shell
git clone https://github.com/wzhzzmzzy/EverydayMail.git
yarn
```

2. 修改`config.yaml`，具体参看文件注释

```shell
yarn dev
```

## 主要功能

- 定时发送邮件：
  - 定时功能使用`js-schedule`；
  - 邮件功能使用`nodemailer`；
  - 邮件模板使用`pug`语法；
- 爬取 ONE·一个 [每日更新](http://wufazhuce.com/)。
- 和风天气[每日预报](https://www.heweather.com/)。
