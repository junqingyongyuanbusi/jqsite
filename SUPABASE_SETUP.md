# Supabase 配置指南

## 快速开始

本指南将帮助您在 10 分钟内完成 Supabase 配置，让导航站正常运行。

## 第一步：创建 Supabase 账号和项目

### 1.1 注册账号
1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）或邮箱注册

### 1.2 创建新项目
1. 点击 "New project"
2. 填写项目信息：
   - **项目名称**: `my-nav-site` (或自定义)
   - **数据库密码**: 设置一个强密码（保存好！）
   - **地区**: 选择离您最近的地区（如 Singapore）
3. 点击 "Create new project"
4. 等待项目初始化（约 2 分钟）

## 第二步：获取项目凭证

项目创建完成后，在项目主页获取以下信息：

### 2.1 进入设置页面
1. 点击左侧菜单 "Settings"（设置图标）
2. 选择 "API" 子菜单

### 2.2 复制凭证
找到并复制以下信息：
- **Project URL**: `https://xxxxx.supabase.co`
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **重要**：`service_role` 密钥具有完全访问权限，请妥善保管，不要泄露！

## 第三步：配置数据库

### 3.1 打开 SQL 编辑器
1. 点击左侧菜单 "SQL Editor"
2. 点击 "New query"

### 3.2 执行建表语句
1. 复制 `database/schema.sql` 文件的全部内容
2. 粘贴到 SQL 编辑器
3. 点击 "Run" 执行

执行成功后，您应该看到：
- ✅ 8 个表创建成功
- ✅ 默认分类数据插入
- ✅ 示例链接数据插入

### 3.3 验证表结构
1. 点击左侧菜单 "Table Editor"
2. 应该看到以下表：
   - nav_links（导航链接）
   - categories（分类）
   - analytics（访问统计）
   - search_history（搜索历史）

## 第四步：配置本地环境

### 4.1 创建环境变量文件
```bash
# 在项目根目录
cp .env.example .env
```

### 4.2 编辑 .env 文件
```env
# Supabase 配置
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（anon public）
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（service_role）

# 服务器配置
PORT=3000
NODE_ENV=development
```

## 第五步：运行项目

### 5.1 安装依赖
```bash
npm install
```

### 5.2 启动服务器
```bash
npm run dev
# 或
npm start
```

### 5.3 访问测试
打开浏览器访问：http://localhost:3000

您应该看到：
- 导航站主页正常显示
- 默认分类和示例链接
- 可以添加/删除链接

## 第六步：测试功能

### 测试清单
- [ ] 页面正常加载
- [ ] 显示示例链接
- [ ] 点击链接可以跳转
- [ ] 搜索功能正常
- [ ] 添加新链接
- [ ] 删除链接
- [ ] 分类筛选

## 常见问题

### Q1: 提示"缺少 Supabase 配置"
**解决方案**：
1. 检查 .env 文件是否存在
2. 确认环境变量名称正确
3. 重启服务器

### Q2: 数据库连接失败
**解决方案**：
1. 检查 SUPABASE_URL 是否正确
2. 确认密钥没有多余的空格
3. 检查 Supabase 项目是否正在运行

### Q3: 添加链接失败
**解决方案**：
1. 确认使用的是 service_role 密钥
2. 检查表是否创建成功
3. 查看服务器控制台错误信息

### Q4: 页面显示模拟数据
**原因**：数据库连接失败，自动降级到模拟数据
**解决方案**：
1. 检查环境变量配置
2. 确认 Supabase 项目状态
3. 查看控制台错误信息

## 高级配置（可选）

### 启用实时功能
1. 在 Supabase 控制台启用 Realtime
2. 选择 nav_links 表
3. 启用 INSERT, UPDATE, DELETE 事件

### 配置 Row Level Security (RLS)
```sql
-- 允许所有人读取
CREATE POLICY "Enable read access for all users" ON nav_links
FOR SELECT USING (true);

-- 只允许认证用户写入（如果添加了认证）
CREATE POLICY "Enable insert for authenticated users only" ON nav_links
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 添加索引优化查询
```sql
-- 优化分类查询
CREATE INDEX idx_nav_links_category ON nav_links(category);

-- 优化搜索
CREATE INDEX idx_nav_links_search ON nav_links USING gin(to_tsvector('simple', name || ' ' || COALESCE(description, '')));
```

## 部署到生产环境

### Vercel 部署
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量：
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY
4. 部署

### 安全建议
1. **生产环境**使用不同的 Supabase 项目
2. 启用 SSL/HTTPS
3. 设置 CORS 白名单
4. 实施速率限制
5. 定期备份数据

## 数据管理

### 通过 Supabase 控制台
1. 访问 Table Editor
2. 可��直接添加/编辑/删除数据
3. 支持 CSV 导入/导出

### 通过 SQL
```sql
-- 添加新链接
INSERT INTO nav_links (name, url, category, description)
VALUES ('OpenAI', 'https://openai.com', 'AI 工具', 'AI 研究组织');

-- 更新链接
UPDATE nav_links
SET click_count = click_count + 1
WHERE id = 'xxx';

-- 删除链接
DELETE FROM nav_links WHERE id = 'xxx';
```

## 监控和维护

### 查看使用情况
1. Supabase Dashboard -> Usage
2. 监控：
   - 数据库大小
   - API 请求数
   - 带宽使用

### 备份策略
1. Supabase 自动每日备份（Pro 计划）
2. 手动导出：
   ```sql
   -- 导出所有数据
   SELECT * FROM nav_links;
   ```

## 获取帮助

- **Supabase 文档**: https://supabase.com/docs
- **项目 Issues**: 在 GitHub 提交问题
- **社区支持**: Supabase Discord

## 下一步

配置完成后，您可以：
1. 自定义分类和链接
2. 修改 UI 主题样式
3. 添加更多功能
4. 部署到生产环境

祝您使用愉快！ 🚀