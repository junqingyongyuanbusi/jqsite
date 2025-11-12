# 🌐 导航网站 (Supabase 版)

> Supabase + Express 驱动的现代化导航站，支持实时搜索、访问统计与 PWA 桌面体验。

## 在线体验与界面预览

- 在线演示：[https://jqsite.vercel.app/](https://jqsite.vercel.app/)
- 已通过 `doc/PWA功能验证清单.md` 的安装校验，可在移动端或桌面端「添加到主屏幕」

<table>
  <tr>
    <td><img src="./doc/samples/11.png" alt="示例1"></td>
    <td><img src="./doc/samples/33.png" alt="示例2"></td>
  </tr>
  <tr>
    <td><img src="./doc/samples/22.png" alt="示例3"></td>
    <td><img src="./doc/samples/55.png" alt="示例4"></td>
  </tr>
   <tr>
    <td><img src="./doc/samples/66.png" alt="示例6"></td>
    <td><img src="./doc/samples/77.png" alt="示例7"></td>
  </tr>
</table>

## 功能亮点

- **Supabase 数据层**：`nav_links`、`categories`、`analytics`、`search_history` 四张核心表，配套索引、视图与 RLS 策略，见 `database/schema.sql`。
- **一体化 REST API**：`server.js` 暴露导航、搜索、统计、Favicon 代理等端点，数据库异常时自动回退内置 `mockData`，保障演示可用。
- **实时搜索与热门榜单**：模糊搜索结合搜索词计数，支持热门关键词接口与前端联想体验。
- **访问统计与洞察**：点击埋点会写入 `analytics`，提供热门链接、分类统计等 API，为后续仪表盘扩展打底。
- **PWA 与多主题体验**：Service Worker、Web App Manifest、CSS 变量和多皮肤暗色模式，支持离线缓存与桌面安装。
- **部署友好**：零构建流程，`vercel.json` 已配置路由，支持一键部署到 Vercel 或任何 Node.js 运行环境。

## 技术栈

### 服务端
- Node.js + Express 提供 API 与静态资源
- `@supabase/supabase-js`、`axios`、`dotenv`、`serverless-http`
- `moment`、`lunar-javascript` 用于时间与农历显示

### 数据层
- Supabase Postgres（行级安全、Realtime、SQL 迁移）
- `database/schema.sql` 和 `database/insert_sites.sql` 提供建表与示例数据

### 前端
- 原生 JavaScript、CSS3、Bootstrap Icons
- PWA 相关文件：`public/manifest.json`、`public/sw.js`
- 主题与皮肤切换细节见 `doc/皮肤切换功能实现总结.md`

### 工具
- `nodemon` 辅助本地热重载 (`npm run dev`)
- `doc/需求.md`、`REFACTOR.md`、`CLAUDE.md` 记录需求及重构计划

## 系统要求

- Node.js ≥ 16（推荐 18+）
- npm ≥ 8
- 可访问 Supabase 的网络环境及项目凭证
- Git（用于获取代码）

## 快速开始

1. **获取代码并安装依赖**

   ```bash
   git clone https://github.com/junqingyongyuanbusi/jqsite.git
   cd navsite
   npm install
   ```

2. **准备环境变量**

   ```bash
   cp .env.example .env
   ```

   | 变量 | 说明 | 示例 |
   | --- | --- | --- |
   | `SUPABASE_URL` | Supabase Project URL | `https://xxxx.supabase.co` |
   | `SUPABASE_ANON_KEY` | 公共 anon key，用于客户端读取 | `eyJhbGciOiJI...` |
   | `SUPABASE_SERVICE_KEY` | `service_role` key，服务端读写专用 | `eyJhbGciOiJI...` |
   | `PORT` | 本地开发端口 | `3000` |
   | `NODE_ENV` | 运行环境 | `development` |

   > 若仍需维护旧版飞书多维表格数据，可按需保留 `.env` 中注释的 `APP_ID` 等变量，相关文档见 `doc/创建飞书应用.md`。

3. **初始化 Supabase 数据库**
   - 登录 Supabase 控制台，打开 **SQL Editor**
   - 粘贴 `database/schema.sql` 并执行，自动创建表、索引、RLS 与示例数据
   - 如需更多演示数据，可执行 `database/insert_sites.sql`

4. **启动开发服务器**

   ```bash
   npm run dev
   # 或
   npm start
   ```

5. **访问应用**
   - 打开 [http://localhost:3000](http://localhost:3000)
   - `npm run dev` 会输出 API 与 Supabase 连接状态，便于调试

> 更详细的图文操作步骤请查看 `SUPABASE_SETUP.md`。

## Supabase 配置速览

1. 在 [supabase.com](https://supabase.com) 创建项目，记录 Project URL、anon key、service_role key。
2. `database/schema.sql` 会创建：
   - `nav_links`、`categories`、`analytics`、`search_history` 四张表
   - 热门链接视图 `popular_links`、分类统计视图 `category_stats`
   - RLS 策略与更新时间触发器
3. 可选：通过 Realtime 面板对 `nav_links` 开启 INSERT/UPDATE/DELETE 订阅，便于前端实时刷新。
4. 生产环境请：
   - 为 service role key 加密存放（仅后端使用）
   - 配置 CORS 白名单、速率限制
   - 定期导出数据或启用 Supabase 自动备份

## 项目结构

```text
├── public/                     # 静态资源与 PWA 相关文件
│   ├── css/style.css
│   ├── js/app.js
│   ├── manifest.json
│   ├── sw.js
│   └── img/...
├── lib/
│   └── supabase.js             # Supabase 客户端与服务封装
├── database/
│   ├── schema.sql              # 建表与基础数据
│   └── insert_sites.sql        # 可选示例数据
├── doc/                        # 需求、皮肤、PWA、旧版飞书文档
├── SUPABASE_SETUP.md           # 详细配置指南
├── server.js                   # Express API 入口
├── vercel.json                 # Vercel 路由与环境配置
└── package.json
```

## npm 脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 使用 `nodemon` 启动本地开发服务器 |
| `npm start` | 以 Node.js 直接运行 `server.js`（生产/预览） |
| `npm run build` | 占位命令，当前无构建步骤 |
| `npm run vercel-build` | Vercel 部署钩子，确保 Serverless 函数可用 |

## API 概览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/navigation` | 获取全部分类及导航数据，附带日期信息 |
| `GET` | `/api/search?q=kw` | 搜索链接，联动搜索历史统计 |
| `GET` | `/api/search/popular` | 返回热门搜索关键词 |
| `POST` | `/api/links` | 新增导航链接（需要服务端权限） |
| `PUT` | `/api/links/:id` | 更新链接 |
| `DELETE` | `/api/links/:id` | 删除链接 |
| `GET` | `/api/categories` | 获取所有分类 |
| `POST` | `/api/analytics/track` | 记录点击埋点 |
| `GET` | `/api/analytics/popular` | 获取热门链接 |
| `GET` | `/api/analytics/stats` | 分类维度统计 |
| `GET` | `/api/favicon?url=` | 代理获取网站 Favicon（Google Favicon API） |
| `GET` | `/health` | 健康检查 |

> 服务端默认使用 `SUPABASE_SERVICE_KEY` 访问数据库，外部调用敏感接口时请增加认证或网关。

## 数据模型

- `nav_links`：存储站点名称、URL、描述、分类、标签、图标、排序、推荐等字段。
- `categories`：维护分类名称、Slug、颜色、图标、排序等信息。
- `analytics`：记录点击事件（link_id、visitor_id、UA、来源、时间）。
- `search_history`：存储搜索关键词、次数与最后搜索时间。

所有细节（索引、触发器、视图、RLS）均在 `database/schema.sql` 中定义，可按需扩展。

## 前端与 PWA 体验

- `public/manifest.json` + `public/sw.js` 满足 PWA 安装、离线缓存与自动更新。
- CSS 变量和局部存储实现多皮肤与暗黑模式，方案说明见 `doc/皮肤切换功能实现总结.md`。
- `doc/PWA功能验证清单.md` 提供 Lighthouse/PWA 测试项，方便上线前自检。

## 调试与常见问题

- **缺少 Supabase 配置**：`lib/supabase.js` 会检测环境变量，不完整时直接退出，请确认 `.env` 填写正确后重启。
- **页面只显示示例数据**：服务端无法连接 Supabase 时会回退 `mockData`，请检查网络、密钥或 Supabase 服务状态。
- **暗黑/皮肤切换失效**：清理本地缓存并重载：

  ```javascript
  localStorage.clear();
  location.reload();
  ```

- **API 调试**：`npm run dev` 后访问 `http://localhost:3000/health` 或 `http://localhost:3000/api/navigation`，结合浏览器控制台排查。

更多排障思路可参考 `SUPABASE_SETUP.md` 与文末文档链接。

## 部署

1. 将仓库推送到 GitHub/GitLab。
2. 在 Vercel 选择 **Import Project**，关联仓库。
3. 在 Vercel 项目设置的 Environment Variables 中填入 `SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_KEY` 等。
4. 使用默认的 `vercel.json` 与 `npm run vercel-build` 即可完成 Serverless + 静态资源部署。
5. 自定义域名、监控与日志可以通过 Vercel Dashboard 或自建反向代理完成。

项目同样可以部署到任意支持 Node.js 的平台（Render、Railway、ECS 等），直接执行 `npm start` 即可。

## 文档与支持

- Supabase 图文指南：`SUPABASE_SETUP.md`
- 数据库结构：`database/schema.sql`
- PWA 验证：`doc/PWA功能验证清单.md`
- 主题与皮肤实现：`doc/皮肤切换功能实现总结.md`
- 需求背景：`doc/需求.md`
- 旧版飞书方案：`doc/创建飞书应用.md`、`doc/飞书多维表格设置.md`
- 问题反馈与需求建议：请通过 [GitHub Issues](https://github.com/wubh2012/navsite/issues)

## 贡献指南

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/awesome`
3. 提交更改：`git commit -m "feat: add awesome feature"`
4. 推送分支：`git push origin feature/awesome`
5. 打开 Pull Request，并附上相关截图、复现步骤与测试说明

欢迎提交 Issue/PR 来完善功能、修复问题或改进文档。

## 许可证

本项目基于 MIT License 开源，详情见 `LICENSE`。
