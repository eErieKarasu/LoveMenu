# LoveMenu 微信小程序

LoveMenu 是一个原生微信小程序，提供家庭菜谱、今日点菜、采购清单和家庭食材库存。项目不依赖 Sites、React、Cloudflare 或 GPT 登录。

库存支持“充足 / 不多了 / 用完”的轻量记录，也可以按数量维护。菜谱会根据库存显示缺少的食材，加入采购时只计算短缺部分；采购完成后，勾选的食材可以直接批量入库。

## 技术结构

- 原生微信小程序：WXML、WXSS、JavaScript
- 微信云开发：云函数与云数据库
- 微信 OpenID 鉴权：每个微信账号的数据独立存储
- 本地缓存兜底：云环境不可用时仍可使用，恢复后可重新同步

```text
miniprogram/          小程序前端
  pages/              按功能组织的页面
  services/state.js   云端与本地状态访问
  utils/              默认数据和业务规则
cloudfunctions/state/ 读取和保存状态的云函数
```

## 在微信开发者工具运行

1. 在微信公众平台注册小程序并取得 AppID。
2. 用微信开发者工具导入仓库根目录。
3. 把 `project.config.json` 中的 `touristappid` 换成真实 AppID。
4. 在开发者工具中开通“云开发”，创建一个环境。
5. 把云环境 ID 填入 `miniprogram/env.js` 的 `CLOUD_ENV_ID`。
6. 在云数据库创建集合 `app_states`，权限设为客户端不可直接读写。
7. 右键 `cloudfunctions/state`，选择“上传并部署：云端安装依赖”。
8. 点击“编译”，用真机预览验证微信云同步。

## 配置 AI 创建菜品

菜谱页的“AI 帮我创建”使用 `cloudfunctions/recipe-ai` 调用兼容 Chat Completions 的 HTTPS 接口。密钥只保存在云函数环境变量中，不会进入小程序包。

1. 在微信开发者工具中为 `recipe-ai` 云函数配置环境变量：
   - `RECIPE_AI_API_URL`：完整的 Chat Completions HTTPS 地址。
   - `RECIPE_AI_API_KEY`：服务端 API Key。
   - `RECIPE_AI_MODEL`：该接口支持的模型名称。
2. 右键 `cloudfunctions/recipe-ai`，选择“上传并部署：云端安装依赖”。
3. 确保云环境允许访问所配置的 HTTPS 域名，再用真机发起一次生成测试。

AI 只生成可编辑初稿。用户在确认页点击“确认并保存”前，菜谱不会写入本地或云端状态。可选图片只作为菜谱配图，会随 AI 初稿进入确认表单，不会发送给 AI 模型。

首次启动时菜谱、今日菜单、周计划内容和采购清单均为空。云函数以当前微信 OpenID 作为文档 ID，因此不需要额外注册账号，也不会信任客户端传入的用户 ID。

## 发布

在开发者工具右上角选择“上传”，然后进入微信公众平台提交版本审核。正式发布前还需要补齐小程序名称、图标、服务类目、隐私保护指引和用户隐私授权说明。

## 本地自检

```bash
npm test
npm run check
```

当前版本按单个微信账号同步；“我、伴侣、小朋友”是菜谱口味档案，还不是三个独立微信账号。若要让多位家庭成员共同编辑同一份菜单，下一步可以增加家庭邀请码和成员权限。
