-- Supabase Database Schema for Navigation Site
-- 导航站数据库表结构

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Navigation Links Table (导航链接表)
-- 存储所有导航站点信息
CREATE TABLE nav_links (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                    -- 站点名称
    url TEXT NOT NULL,                             -- 站点链接
    description TEXT,                               -- 站点描述
    category VARCHAR(50) NOT NULL,                 -- 分类
    tags TEXT[],                                    -- 标签数组
    icon_url TEXT,                                  -- 图标链接
    click_count INTEGER DEFAULT 0,                 -- 点击次数
    sort_order INTEGER DEFAULT 0,                  -- 排序权重
    is_featured BOOLEAN DEFAULT FALSE,             -- 是否推荐
    is_active BOOLEAN DEFAULT TRUE,                -- 是否启用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table (分类表)
-- 管理站点分类
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,              -- 分类名称
    slug VARCHAR(50) UNIQUE NOT NULL,              -- URL友好的标识
    icon VARCHAR(50),                              -- 图标类名
    color VARCHAR(7),                              -- 颜色代码 (#RRGGBB)
    sort_order INTEGER DEFAULT 0,                  -- 排序权重
    is_active BOOLEAN DEFAULT TRUE,                -- 是否启用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Analytics Table (访问统计表)
-- 记录站点点击数据
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    link_id UUID REFERENCES nav_links(id) ON DELETE CASCADE,
    visitor_id VARCHAR(100),                       -- 访客标识（可以是IP或UUID）
    user_agent TEXT,                               -- 浏览器信息
    referer TEXT,                                  -- 来源页面
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Search History Table (搜索历史表)
-- 记录用户搜索关键词
CREATE TABLE search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,                 -- 搜索关键词
    count INTEGER DEFAULT 1,                       -- 搜索次数
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以优化查询性能
CREATE INDEX idx_nav_links_category ON nav_links(category);
CREATE INDEX idx_nav_links_sort ON nav_links(sort_order);
CREATE INDEX idx_nav_links_active ON nav_links(is_active);
CREATE INDEX idx_analytics_link_id ON analytics(link_id);
CREATE INDEX idx_analytics_clicked_at ON analytics(clicked_at);
CREATE INDEX idx_search_history_keyword ON search_history(keyword);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 nav_links 表添加触发器
CREATE TRIGGER update_nav_links_updated_at
BEFORE UPDATE ON nav_links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 为 categories 表添加触发器
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 插入默认分类
INSERT INTO categories (name, slug, icon, color, sort_order) VALUES
('开发工具', 'dev-tools', 'bi-code-slash', '#0066ff', 1),
('设计资源', 'design', 'bi-palette', '#ff0066', 2),
('AI 工具', 'ai-tools', 'bi-robot', '#00ffcc', 3),
('学习教育', 'education', 'bi-book', '#ff9900', 4),
('效率工具', 'productivity', 'bi-lightning', '#9966ff', 5),
('娱乐休闲', 'entertainment', 'bi-controller', '#ff3366', 6),
('新闻资讯', 'news', 'bi-newspaper', '#00cc99', 7),
('社交媒体', 'social', 'bi-people', '#ff6600', 8);

-- 插入示例数据（可选）
INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
('GitHub', 'https://github.com', '全球最大的代码托管平台', '开发工具', ARRAY['代码', '开源', 'Git'], 'https://github.com/favicon.ico', 1, true),
('ChatGPT', 'https://chat.openai.com', 'OpenAI 的人工智能对话助手', 'AI 工具', ARRAY['AI', '对话', 'OpenAI'], null, 1, true),
('Figma', 'https://www.figma.com', '协作式界面设计工具', '设计资源', ARRAY['设计', 'UI', '协作'], null, 1, true),
('Notion', 'https://www.notion.so', '全能的笔记和协作工具', '效率工具', ARRAY['笔记', '协作', '文档'], null, 1, true),
('MDN Web Docs', 'https://developer.mozilla.org', 'Web 技术文档', '学习教育', ARRAY['文档', 'Web', 'JavaScript'], null, 2, false),
('Stack Overflow', 'https://stackoverflow.com', '程序员问答社区', '开发工具', ARRAY['问答', '编程', '社区'], null, 2, false);

-- Row Level Security (RLS) 配置
-- 启用 RLS
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略（所有人可读）
CREATE POLICY "Public read access for nav_links" ON nav_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for categories" ON categories
    FOR SELECT USING (is_active = true);

-- 创建公共插入策略（允许匿名用户记录统计）
CREATE POLICY "Public insert access for analytics" ON analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert/update access for search_history" ON search_history
    FOR ALL WITH CHECK (true);

-- 注意：写入操作（INSERT, UPDATE, DELETE）应该通过服务端 API 使用 service_role key
-- 或者配置适当的认证策略

-- 创建视图：热门链接
CREATE VIEW popular_links AS
SELECT
    nl.*,
    COUNT(a.id) as total_clicks
FROM nav_links nl
LEFT JOIN analytics a ON nl.id = a.link_id
WHERE nl.is_active = true
GROUP BY nl.id
ORDER BY total_clicks DESC, nl.sort_order ASC;

-- 创建视图：分类统计
CREATE VIEW category_stats AS
SELECT
    c.*,
    COUNT(nl.id) as link_count
FROM categories c
LEFT JOIN nav_links nl ON c.name = nl.category AND nl.is_active = true
WHERE c.is_active = true
GROUP BY c.id
ORDER BY c.sort_order ASC;