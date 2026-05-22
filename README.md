# Timeliner

一个可 fork 的个人时间线静态站点。用来记录任何带日期的事情——旅行、项目历程、读书笔记、人生大事。

基于 Astro + TypeScript 构建，一个配置文件控制所有内容，4 个内置主题开箱即用。

## 快速开始

```bash
# 1. Fork 本仓库后 clone 到本地
git clone https://github.com/your-name/timeliner.git
cd timeliner

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

打开 http://localhost:4321 即可看到效果。

## 配置

编辑根目录下的 `timeliner.config.ts`：

```ts
export default {
  title: 'My Timeline',   // 页面标题
  description: '...',     // 副标题
  theme: 'chalk',         // 主题：chalk | ocean | neon | parchment
  lang: {
    primary: 'zh',        // 主语言
    secondary: 'en',      // 第二语言（false 则禁用双语）
  },
  photos: {
    thumbWidth: 400,      // 缩略图宽度（像素）
  },
};
```

## 添加记录

在 `src/content/days/` 目录下创建 `YYYY-MM-DD.md` 文件：

```markdown
---
title: 记录标题
date: 2026-04-05
photos:
  - 2026-04-05/photo1.jpg   # 可选，图片路径相对于 public/photos/
---

正文内容，支持完整的 **Markdown** 语法。
```

记录会自动按日期倒序排列（最新的在最上方）。

## 主题

| 主题 | 风格 |
|---|---|
| `chalk` | 深色背景，白色文字，系统无衬线字体 |
| `ocean` | 深蓝背景，天蓝色节点高亮 |
| `neon` | 纯黑背景，粉色/青色荧光效果，等宽字体 |
| `parchment` | 暖白背景，棕色调，衬线字体 |

修改 `timeliner.config.ts` 中的 `theme` 字段后刷新页面即可切换。

### 自定义主题

1. 在 `public/styles/themes/` 下新建 `my-theme.css`
2. 复制任意内置主题作为起点，所有可用 CSS 变量都已列在其中
3. 在配置中设置 `theme: '/styles/themes/my-theme.css'`

## 图片

1. 将原图放入 `public/photos/`（建议按日期建子目录，如 `public/photos/2026-04-05/`）
2. 运行缩略图生成脚本（需要 ImageMagick）：

```bash
brew install imagemagick   # 首次使用需安装
bash scripts/gen-thumbs.sh
```

3. 在 frontmatter 中引用：`photos: - 2026-04-05/photo1.jpg`

缺失的图片会被静默跳过，不影响构建。

## 双语

启用 `lang.secondary: 'en'` 后，`/en/` 路由会渲染同一批记录，并将日期格式切换为英文（如 `April 5, 2026`）。页面头部会出现语言切换链接。

设置 `lang.secondary: false` 禁用第二语言，访问 `/en/` 会自动跳转回主页。

## 部署

```bash
pnpm build   # 构建产物输出到 dist/
```

兼容 GitHub Pages、Netlify、Vercel、Cloudflare Pages 等静态托管平台。

## 目录结构

```
timeliner/
├── timeliner.config.ts       # 用户配置（唯一需要修改的配置文件）
├── src/
│   ├── content/days/         # 时间线记录（Markdown 文件）
│   ├── components/           # Astro 组件
│   ├── layouts/              # 页面布局
│   ├── pages/                # 路由页面
│   └── utils/                # 工具函数
├── public/
│   ├── photos/               # 原始图片
│   ├── photos-thumb/         # 缩略图（构建产物，已 gitignore）
│   └── styles/themes/        # 主题 CSS 文件
└── scripts/
    └── gen-thumbs.sh         # 缩略图生成脚本
```
