const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const appConfig = readJson("miniprogram/app.json");
const projectConfig = readJson("project.config.json");

const errors = [];
if (fs.existsSync(path.join(root, ".openai/hosting.json"))) errors.push("仍存在 Sites hosting 配置");
if (projectConfig.miniprogramRoot !== "miniprogram/") errors.push("miniprogramRoot 配置不正确");
if (projectConfig.cloudfunctionRoot !== "cloudfunctions/") errors.push("cloudfunctionRoot 配置不正确");

for (const page of appConfig.pages) {
  const pageScript = path.join(root, "miniprogram", `${page}.js`);
  const pageTemplate = path.join(root, "miniprogram", `${page}.wxml`);
  for (const extension of ["js", "json", "wxml", "wxss"]) {
    const file = path.join(root, "miniprogram", `${page}.${extension}`);
    if (!fs.existsSync(file)) errors.push(`缺少页面文件：${path.relative(root, file)}`);
  }
  if (fs.existsSync(pageScript) && fs.existsSync(pageTemplate)) {
    const script = fs.readFileSync(pageScript, "utf8");
    const template = fs.readFileSync(pageTemplate, "utf8");
    const handlers = [...template.matchAll(/(?:bind|catch)[a-z]+="([A-Za-z_$][\w$]*)"/g)].map((match) => match[1]);
    for (const handler of new Set(handlers)) {
      if (!new RegExp(`\\b${handler}\\s*\\(`).test(script)) errors.push(`页面事件未实现：${page} -> ${handler}`);
    }
    if (/\{\{[^}]*\.[A-Za-z_$][\w$]*\(/.test(template)) errors.push(`WXML 中包含不受支持的方法调用：${page}`);
  }
}

for (const tab of appConfig.tabBar.list) {
  if (!appConfig.pages.includes(tab.pagePath)) errors.push(`TabBar 页面未注册：${tab.pagePath}`);
  for (const icon of [tab.iconPath, tab.selectedIconPath]) {
    if (!fs.existsSync(path.join(root, "miniprogram", icon))) errors.push(`缺少 TabBar 图标：${icon}`);
  }
}

if (appConfig.tabBar.custom) {
  for (const extension of ["js", "json", "wxml", "wxss"]) {
    const file = path.join(root, "miniprogram/custom-tab-bar", `index.${extension}`);
    if (!fs.existsSync(file)) errors.push(`缺少自定义 TabBar 文件：${path.relative(root, file)}`);
  }
}

if (!fs.existsSync(path.join(root, "cloudfunctions/state/index.js"))) errors.push("缺少 state 云函数");
if (!fs.existsSync(path.join(root, "cloudfunctions/recipe-ai/index.js"))) errors.push("缺少 recipe-ai 云函数");

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`LoveMenu 小程序结构检查通过：${appConfig.pages.length} 个页面，${appConfig.tabBar.list.length} 个 Tab。`);
