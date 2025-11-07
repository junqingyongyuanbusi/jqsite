/**
 * 导航站服务器 - Supabase 版本
 * 使用 Supabase 作为数据源，支持实时同步和访问统计
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const { Lunar } = require('lunar-javascript');
moment.locale('zh-cn');

// 导入 Supabase 服务
const {
  navLinksService,
  categoriesService,
  analyticsService,
  searchService
} = require('./lib/supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// 解析JSON请求体
app.use(express.json());

// CORS 配置（允许跨域请求）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 获取农历日期字符串
function getLunarDateString() {
  const date = new Date();
  const lunar = Lunar.fromDate(date);
  let result = '';

  // 处理闰月
  if (lunar.isLeap) {
    result += '闰';
  }

  // 月份和日期
  result += lunar.getMonthInChinese() + '月' + lunar.getDayInChinese();

  // 获取节气
  const jieQi = lunar.getJieQi();
  if (jieQi) {
    result += ' ' + jieQi;
  }

  return result;
}

// 获取日期信息
function getDateInfo() {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const today = new Date();
  const chineseWeekday = weekdays[today.getDay()];

  return {
    time: moment().format('HH:mm'),
    date: moment().format('M月D日'),
    weekday: chineseWeekday,
    lunarDate: getLunarDateString()
  };
}

// 模拟数据（当无法连接数据库时使用）
const mockData = {
  '开发工具': [
    { id: 'mock_001', name: 'GitHub', url: 'https://github.com', description: '全球最大的代码托管平台', category: '开发工具', tags: ['代码', '开源'], icon_url: null, click_count: 0, sort_order: 1, is_featured: true },
    { id: 'mock_002', name: 'Stack Overflow', url: 'https://stackoverflow.com', description: '程序员问答社区', category: '开发工具', tags: ['问答', '编程'], icon_url: null, click_count: 0, sort_order: 2, is_featured: false },
    { id: 'mock_003', name: 'VSCode', url: 'https://code.visualstudio.com', description: '微软开源代码编辑器', category: '开发工具', tags: ['编辑器', 'IDE'], icon_url: null, click_count: 0, sort_order: 3, is_featured: false },
    { id: 'mock_004', name: 'CodePen', url: 'https://codepen.io', description: '前端代码演示平台', category: '开发工具', tags: ['前端', '演示'], icon_url: null, click_count: 0, sort_order: 4, is_featured: false }
  ],
  '设计资源': [
    { id: 'mock_005', name: 'Figma', url: 'https://figma.com', description: '协作式界面设计工具', category: '设计资源', tags: ['设计', 'UI'], icon_url: null, click_count: 0, sort_order: 1, is_featured: true },
    { id: 'mock_006', name: 'Dribbble', url: 'https://dribbble.com', description: '设计师作品分享社区', category: '设计资源', tags: ['设计', '作品'], icon_url: null, click_count: 0, sort_order: 2, is_featured: false },
    { id: 'mock_007', name: 'Behance', url: 'https://behance.net', description: 'Adobe旗下设计社区', category: '设计资源', tags: ['设计', '作品集'], icon_url: null, click_count: 0, sort_order: 3, is_featured: false },
    { id: 'mock_008', name: 'Unsplash', url: 'https://unsplash.com', description: '高质量免费图片库', category: '设计资源', tags: ['图片', '素材'], icon_url: null, click_count: 0, sort_order: 4, is_featured: false }
  ],
  'AI 工具': [
    { id: 'mock_009', name: 'ChatGPT', url: 'https://chat.openai.com', description: 'OpenAI 的人工智能对话助手', category: 'AI 工具', tags: ['AI', '对话'], icon_url: null, click_count: 0, sort_order: 1, is_featured: true },
    { id: 'mock_010', name: 'Claude', url: 'https://claude.ai', description: 'Anthropic 的 AI 助手', category: 'AI 工具', tags: ['AI', '对话'], icon_url: null, click_count: 0, sort_order: 2, is_featured: true },
    { id: 'mock_011', name: 'Midjourney', url: 'https://midjourney.com', description: 'AI 图像生成工具', category: 'AI 工具', tags: ['AI', '图像'], icon_url: null, click_count: 0, sort_order: 3, is_featured: false },
    { id: 'mock_012', name: 'Perplexity', url: 'https://perplexity.ai', description: 'AI 搜索引擎', category: 'AI 工具', tags: ['AI', '搜索'], icon_url: null, click_count: 0, sort_order: 4, is_featured: false }
  ],
  '效率工具': [
    { id: 'mock_013', name: 'Notion', url: 'https://notion.so', description: '全能的笔记和协作工具', category: '效率工具', tags: ['笔记', '协作'], icon_url: null, click_count: 0, sort_order: 1, is_featured: true },
    { id: 'mock_014', name: 'Trello', url: 'https://trello.com', description: '看板式项目管理工具', category: '效率工具', tags: ['项目管理', '协作'], icon_url: null, click_count: 0, sort_order: 2, is_featured: false },
    { id: 'mock_015', name: 'Slack', url: 'https://slack.com', description: '团队沟通协作平台', category: '效率工具', tags: ['沟通', '协作'], icon_url: null, click_count: 0, sort_order: 3, is_featured: false },
    { id: 'mock_016', name: 'Obsidian', url: 'https://obsidian.md', description: '本地知识库管理工具', category: '效率工具', tags: ['笔记', '知识库'], icon_url: null, click_count: 0, sort_order: 4, is_featured: false }
  ]
};

// ==================== API 路由 ====================

/**
 * 获取导航数据
 * GET /api/navigation
 */
app.get('/api/navigation', async (req, res) => {
  try {
    let data;
    let categories;
    let isMockData = false;

    try {
      // 从 Supabase 获取数据
      data = await navLinksService.getLinksByCategory();
      categories = Object.keys(data).sort();

      // 如果没有数据，使用模拟数据
      if (categories.length === 0) {
        console.log('数据库为空，使用模拟数据');
        data = mockData;
        categories = Object.keys(mockData);
        isMockData = true;
      }
    } catch (dbError) {
      console.error('无法从数据库获取数据，使用模拟数据:', dbError.message);
      // 使用模拟数据
      data = mockData;
      categories = Object.keys(mockData);
      isMockData = true;
    }

    res.json({
      success: true,
      isMockData: isMockData,
      data: data,
      categories: categories,
      timestamp: new Date().toISOString(),
      dateInfo: getDateInfo()
    });
  } catch (error) {
    console.error('API错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 搜索导航链接
 * GET /api/search?q=keyword
 */
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
        keyword: q
      });
    }

    const results = await searchService.searchLinks(q);

    res.json({
      success: true,
      data: results,
      keyword: q,
      count: results.length
    });
  } catch (error) {
    console.error('搜索错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取热门搜索
 * GET /api/search/popular
 */
app.get('/api/search/popular', async (req, res) => {
  try {
    const popularSearches = await searchService.getPopularSearches(10);

    res.json({
      success: true,
      data: popularSearches
    });
  } catch (error) {
    console.error('获取热门搜索错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 添加新的网站链接
 * POST /api/links
 */
app.post('/api/links', async (req, res) => {
  try {
    const linkData = req.body;

    // 验证必要的字段
    if (!linkData.name || !linkData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: '网站名称不能为空'
      });
    }

    if (!linkData.url || !linkData.url.trim()) {
      return res.status(400).json({
        success: false,
        message: '网站网址不能为空'
      });
    }

    if (!linkData.category || !linkData.category.trim()) {
      return res.status(400).json({
        success: false,
        message: '分类不能为空'
      });
    }

    // 验证网址格式
    try {
      new URL(linkData.url.startsWith('http') ? linkData.url : `https://${linkData.url}`);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: '无效的网址格式'
      });
    }

    // 验证网站名称长度
    if (linkData.name.length > 100) {
      return res.status(400).json({
        success: false,
        message: '网站名称长度不能超过100个字符'
      });
    }

    // 添加到数据库
    const newLink = await navLinksService.addLink(linkData);

    res.json({
      success: true,
      message: '链接添加成功',
      data: newLink
    });
  } catch (error) {
    console.error('添加链接错误:', error);
    res.status(500).json({
      success: false,
      message: `添加链接失败: ${error.message}`
    });
  }
});

/**
 * 更新链接
 * PUT /api/links/:id
 */
app.put('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: '链接ID不能为空'
      });
    }

    const updatedLink = await navLinksService.updateLink(id, updates);

    res.json({
      success: true,
      message: '链接更新成功',
      data: updatedLink
    });
  } catch (error) {
    console.error('更新链接错误:', error);
    res.status(500).json({
      success: false,
      message: `更新链接失败: ${error.message}`
    });
  }
});

/**
 * 删除链接
 * DELETE /api/links/:id
 */
app.delete('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: '链接ID不能为空'
      });
    }

    await navLinksService.deleteLink(id);

    res.json({
      success: true,
      message: '链接删除成功'
    });
  } catch (error) {
    console.error('删除链接错误:', error);
    res.status(500).json({
      success: false,
      message: `删除链接失败: ${error.message}`
    });
  }
});

/**
 * 获取所有分类
 * GET /api/categories
 */
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await categoriesService.getAllCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取分类错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 记录点击统计
 * POST /api/analytics/track
 */
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { linkId, visitorId } = req.body;

    if (!linkId) {
      return res.status(400).json({
        success: false,
        message: '链接ID不能为空'
      });
    }

    await analyticsService.trackClick(linkId, {
      visitorId,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer
    });

    res.json({
      success: true,
      message: '点击记录成功'
    });
  } catch (error) {
    console.error('记录点击错误:', error);
    // 统计错误不应该影响用户体验
    res.json({
      success: true,
      message: 'OK'
    });
  }
});

/**
 * 获取热门链接
 * GET /api/analytics/popular
 */
app.get('/api/analytics/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popularLinks = await analyticsService.getPopularLinks(limit);

    res.json({
      success: true,
      data: popularLinks
    });
  } catch (error) {
    console.error('获取热门链接错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取分类统计
 * GET /api/analytics/stats
 */
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const stats = await analyticsService.getCategoryStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('获取统计数据错误:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Favicon代理端点（保留原有功能）
 * GET /api/favicon?url=xxx
 */
app.get('/api/favicon', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: '缺少url参数'
      });
    }

    // 验证URL格式
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: '无效的URL格式'
      });
    }

    // 只允许http和https协议
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: '只支持HTTP和HTTPS协议'
      });
    }

    // 尝试获取网站的favicon
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&size=32`;

    // 代理请求到Google favicon服务
    const response = await axios.get(faviconUrl, {
      responseType: 'arraybuffer',
      timeout: 5000 // 5秒超时
    });

    // 设置正确的Content-Type
    res.set('Content-Type', response.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=86400'); // 缓存24小时

    // 返回图片数据
    res.send(response.data);

  } catch (error) {
    console.error('Favicon代理错误:', error.message);

    // 返回一个透明的1x1像素图片作为fallback
    const fallbackImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=300'); // 缓存5分钟
    res.send(fallbackImage);
  }
});

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 导航站服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 使用 Supabase 作为数据源`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

module.exports = app;