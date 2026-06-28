# 荒野乱斗资料站（Brawl Stars Showcase）

一个以 Supercell 手游《荒野乱斗》（Brawl Stars）为主题的资料展示站点，面向中文玩家，定位为“图鉴 + 赛事”中心。

在线地址：https://brawlstars-showcase.vercel.app/

---

## 主要功能

- **英雄图鉴**：104 位英雄列表、分类筛选、英雄详情页（属性、普攻、大招、星辉、妙具、装备、极限充能、皮肤、背景故事）。
- **对战地图**：地图列表、按模式/实时天梯池筛选、地图收藏与推荐。
- **游戏模式**：模式卡片、实时轮换倒计时、模式详情页。
- **赛事中心**：赛事列表、战队/选手档案、赛程日历、数据统计、淘汰赛进程树（含 2025 Brawl Cup 自定义对阵图）。
- **用户系统**：注册登录、英雄/地图/赛事收藏、浏览历史、个人分享卡片。
- **个性化推荐**：基于用户收藏分布的轮询推荐算法，避免只推荐单一类别。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 16.2.6（App Router） |
| UI 库 | React 19.2.4 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 |
| 认证 | Auth.js v5 beta（Credentials + JWT） |
| ORM | Prisma 7.8.0 |
| 数据库 | Neon PostgreSQL |
| 包管理 | npm |
| 部署 | Vercel |

---

## 环境变量

复制 `.env.local.example` 为 `.env.local` 并填写：

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-auth-secret"
BRAWL_API_TOKEN="your-brawlstars-api-token"  # 可选，用于实时地图/赛事数据
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000。

---

## 构建与部署

```bash
npm run build
npm run start
```

项目已配置 Vercel 构建命令 `prisma generate && next build`，每次部署会自动生成 Prisma Client。

---

## 数据来源

- 英雄/地图/模式数据：BrawlAPI / Supercell 官方 API（通过 `/api/brawl-data`、`/api/rotation` 代理）。
- 赛事数据：Liquipedia（通过 `scripts/fetch_liquipedia_esports.py` 抓取并合并）。

---

## 项目结构

```
app/                  # Next.js App Router 页面与 API
components/           # React 组件
hooks/                # 自定义 Hooks
lib/                  # 数据、工具函数
prisma/               # Prisma schema 与迁移
public/               # 静态资源
scripts/              # 数据抓取脚本
```

---

## 课程信息

- 课程名称：Web应用开发技术
- 项目类型：二人小组大作业
- 本仓库为小组共用源代码与文档
