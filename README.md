# LoveMenu

LoveMenu 是一个面向家庭的菜谱、每日菜单、一周安排和采购清单应用。

## 技术结构

- Codex Sites / vinext
- React 19
- Cloudflare D1
- Drizzle ORM 与可版本化数据库迁移

## 本地开发

```bash
npm install
npm run dev
```

## 验证

```bash
npm run build
node --test tests/rendered-html.test.mjs
```

`prototype.html` 保留了迁移到 Sites 之前的原型入口，正式应用由 `app/` 和 `public/lovemenu.js` 提供。
