-- =====================================================
-- 导航站点数据插入脚本
-- 共计 90+ 个精选网站，覆盖 8 大分类
-- 生成日期: 2025-11-11
-- =====================================================

-- =====================================================
-- 1. 开发工具类 (15个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 技术社区
('稀土掘金', 'https://juejin.cn', '中国领先的技术社区，为开发者提供优质技术文章', '开发工具', ARRAY['技术社区', '博客', '前端'], null, 3, true),
('CSDN', 'https://www.csdn.net', '中国最大的IT社区和服务平台', '开发工具', ARRAY['技术社区', '博客', '问答'], null, 4, false),
('SegmentFault', 'https://segmentfault.com', '中文开发者社区，提供技术问答和分享', '开发工具', ARRAY['技术社区', '问答', '开源'], null, 5, false),
('LeetCode', 'https://leetcode.cn', '全球领先的在线编程学习平台', '开发工具', ARRAY['算法', '刷题', '面试'], null, 6, true),
('GitCode', 'https://gitcode.net', 'CSDN旗下代码托管平台', '开发工具', ARRAY['代码托管', 'Git', '开源'], null, 7, false),

-- 开发工具
('Visual Studio Code', 'https://code.visualstudio.com', '微软出品的免费开源代码编辑器', '开发工具', ARRAY['IDE', '编辑器', '开发'], null, 8, true),
('JetBrains', 'https://www.jetbrains.com', '专业开发工具提供商', '开发工具', ARRAY['IDE', '开发工具', 'IntelliJ'], null, 9, false),
('Postman', 'https://www.postman.com', 'API开发协作平台', '开发工具', ARRAY['API', '测试', '开发'], null, 10, false),
('Docker Hub', 'https://hub.docker.com', 'Docker官方镜像仓库', '开发工具', ARRAY['Docker', '容器', 'DevOps'], null, 11, false),
('npm', 'https://www.npmjs.com', 'Node.js包管理器', '开发工具', ARRAY['Node.js', '包管理', 'JavaScript'], null, 12, false),

-- 云服务平台
('Cloudflare', 'https://www.cloudflare.com', '全球领先的CDN和网络安全服务', '开发工具', ARRAY['CDN', '安全', '云服务'], null, 13, false),
('Vercel', 'https://vercel.com', '前端部署平台，Next.js官方推荐', '开发工具', ARRAY['部署', 'Next.js', '前端'], null, 14, true),
('Railway', 'https://railway.app', '简单易用的云平台', '开发工具', ARRAY['部署', '云服务', 'PaaS'], null, 15, false),
('阿里云', 'https://www.aliyun.com', '阿里巴巴旗下云计算平台', '开发工具', ARRAY['云服务', '阿里', '服务器'], null, 16, false),
('腾讯云', 'https://cloud.tencent.com', '腾讯旗下云计算平台', '开发工具', ARRAY['云服务', '腾讯', '服务器'], null, 17, false);

-- =====================================================
-- 2. 设计资源类 (12个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 国内设计工具
('即时设计', 'https://js.design', '国内领先的在线协作设计工具', '设计资源', ARRAY['设计', 'UI', '协作'], null, 2, true),
('MasterGo', 'https://mastergo.com', '面向团队的专业UI/UX设计工具', '设计资源', ARRAY['设计', 'UI', '协作'], null, 3, false),
('蓝湖', 'https://lanhuapp.com', '高效的产品设计协作平台', '设计资源', ARRAY['设计', '协作', '标注'], null, 4, false),
('Pixso', 'https://pixso.cn', '一站式设计协作工具', '设计资源', ARRAY['设计', 'UI', '协作'], null, 5, false),
('摹客', 'https://www.mockplus.cn', '简洁高效的原型设计工具', '设计资源', ARRAY['原型', '设计', '协作'], null, 6, false),

-- 国际设计平台
('Dribbble', 'https://dribbble.com', '全球设计师作品分享社区', '设计资源', ARRAY['设计', '灵感', '作品集'], null, 7, true),
('Behance', 'https://www.behance.net', 'Adobe旗下创意作品展示平台', '设计资源', ARRAY['设计', '作品集', 'Adobe'], null, 8, false),

-- 图片素材
('Unsplash', 'https://unsplash.com', '免费高清图片素材库', '设计资源', ARRAY['图片', '素材', '免费'], null, 9, true),
('Pexels', 'https://www.pexels.com', '免费商用图片和视频素材', '设计资源', ARRAY['图片', '视频', '素材'], null, 10, false),
('Iconfont', 'https://www.iconfont.cn', '阿里巴巴矢量图标库', '设计资源', ARRAY['图标', '矢量', '阿里'], null, 11, true),
('觅元素', 'https://www.51yuansu.com', '免抠PNG素材网站', '设计资源', ARRAY['素材', 'PNG', '免抠图'], null, 12, false),
('千图网', 'https://www.58pic.com', '专注免费设计素材下载', '设计资源', ARRAY['素材', '设计', '模板'], null, 13, false);

-- =====================================================
-- 3. AI 工具类 (12个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 国产AI对话
('文心一言', 'https://yiyan.baidu.com', '百度推出的AI对话助手', 'AI 工具', ARRAY['AI', '对话', '百度'], null, 2, true),
('通义千问', 'https://tongyi.aliyun.com', '阿里云推出的大语言模型', 'AI 工具', ARRAY['AI', '对话', '阿里'], null, 3, true),
('讯飞星火', 'https://xinghuo.xfyun.cn', '科大讯飞认知大模型', 'AI 工具', ARRAY['AI', '对话', '讯飞'], null, 4, false),
('Kimi', 'https://kimi.moonshot.cn', 'Moonshot AI 推出的智能助手', 'AI 工具', ARRAY['AI', '对话', '长文本'], null, 5, true),
('豆包', 'https://www.doubao.com', '字节跳动推出的AI助手', 'AI 工具', ARRAY['AI', '对话', '字节'], null, 6, false),

-- 国际AI工具
('Claude', 'https://claude.ai', 'Anthropic推出的AI助手', 'AI 工具', ARRAY['AI', '对话', 'Anthropic'], null, 7, true),
('Google Gemini', 'https://gemini.google.com', '谷歌最新AI模型', 'AI 工具', ARRAY['AI', '对话', 'Google'], null, 8, false),
('Microsoft Copilot', 'https://copilot.microsoft.com', '微软AI助手', 'AI 工具', ARRAY['AI', '对话', '微软'], null, 9, false),

-- AI创作工具
('Midjourney', 'https://www.midjourney.com', '顶级AI绘画工具', 'AI 工具', ARRAY['AI', '绘画', '创作'], null, 10, true),
('Stable Diffusion', 'https://stability.ai', '开源AI图像生成模型', 'AI 工具', ARRAY['AI', '绘画', '开源'], null, 11, false),
('Runway', 'https://runwayml.com', 'AI视频编辑和生成工具', 'AI 工具', ARRAY['AI', '视频', '创作'], null, 12, false),
('Hugging Face', 'https://huggingface.co', 'AI模型和数据集社区', 'AI 工具', ARRAY['AI', '模型', '开源'], null, 13, false);

-- =====================================================
-- 4. 学习教育类 (13个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 国内学习平台
('中国大学MOOC', 'https://www.icourse163.org', '国家精品在线开放课程平台', '学习教育', ARRAY['课程', 'MOOC', '大学'], null, 3, true),
('学堂在线', 'https://www.xuetangx.com', '清华大学发起的MOOC平台', '学习教育', ARRAY['课程', 'MOOC', '清华'], null, 4, false),
('网易云课堂', 'https://study.163.com', '网易旗下在线学习平台', '学习教育', ARRAY['课程', '职业', '技能'], null, 5, false),
('哔哩哔哩', 'https://www.bilibili.com', 'B站知识区优质学习内容', '学习教育', ARRAY['视频', '学习', '知识'], null, 6, true),
('慕课网', 'https://www.imooc.com', 'IT技能学习平台', '学习教育', ARRAY['编程', '技术', 'IT'], null, 7, false),

-- 国际学习平台
('Coursera', 'https://www.coursera.org', '全球顶尖大学在线课程', '学习教育', ARRAY['课程', 'MOOC', '大学'], null, 8, true),
('edX', 'https://www.edx.org', '哈佛MIT创办的MOOC平台', '学习教育', ARRAY['课程', 'MOOC', '名校'], null, 9, false),
('Khan Academy', 'https://www.khanacademy.org', '免费在线学习平台', '学习教育', ARRAY['课程', '免费', 'K12'], null, 10, false),
('freeCodeCamp', 'https://www.freecodecamp.org', '免费编程学习平台', '学习教育', ARRAY['编程', '免费', 'Web'], null, 11, true),
('W3Schools', 'https://www.w3schools.com', 'Web技术教程网站', '学习教育', ARRAY['教程', 'Web', '编程'], null, 12, false),

-- 技术文档博客
('菜鸟教程', 'https://www.runoob.com', '编程入门教程网站', '学习教育', ARRAY['教程', '编程', '入门'], null, 13, true),
('廖雪峰', 'https://www.liaoxuefeng.com', '廖雪峰的官方网站', '学习教育', ARRAY['教程', 'Python', 'Git'], null, 14, false),
('阮一峰博客', 'https://www.ruanyifeng.com/blog', '阮一峰的网络日志', '学习教育', ARRAY['博客', '技术', '科技'], null, 15, false);

-- =====================================================
-- 5. 效率工具类 (12个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 协作办公
('飞书', 'https://www.feishu.cn', '字节跳动旗下企业协作平台', '效率工具', ARRAY['协作', '办公', '字节'], null, 2, true),
('钉钉', 'https://www.dingtalk.com', '阿里巴巴企业协作平台', '效率工具', ARRAY['协作', '办公', '阿里'], null, 3, true),
('企业微信', 'https://work.weixin.qq.com', '腾讯企业级办公工具', '效率工具', ARRAY['协作', '办公', '腾讯'], null, 4, false),

-- 文档笔记
('语雀', 'https://www.yuque.com', '专业的云端知识库', '效率工具', ARRAY['文档', '知识库', '阿里'], null, 5, true),
('石墨文档', 'https://shimo.im', '在线协作文档和表格', '效率工具', ARRAY['文档', '协作', '表格'], null, 6, false),
('腾讯文档', 'https://docs.qq.com', '腾讯在线文档工具', '效率工具', ARRAY['文档', '协作', '腾讯'], null, 7, false),
('金山文档', 'https://www.kdocs.cn', 'WPS在线文档', '效率工具', ARRAY['文档', '协作', 'WPS'], null, 8, false),
('印象笔记', 'https://www.yinxiang.com', '专业笔记软件', '效率工具', ARRAY['笔记', '知识管理', 'Evernote'], null, 9, false),
('有道云笔记', 'https://note.youdao.com', '网易有道笔记工具', '效率工具', ARRAY['笔记', '云同步', '网易'], null, 10, false),

-- 任务管理
('滴答清单', 'https://www.dida365.com', '轻便的待办事项和任务管理工具', '效率工具', ARRAY['任务', '待办', 'GTD'], null, 11, true),
('Todoist', 'https://todoist.com', '强大的任务管理工具', '效率工具', ARRAY['任务', '待办', 'GTD'], null, 12, false),
('Trello', 'https://trello.com', '看板式项目管理工具', '效率工具', ARRAY['项目管理', '看板', '协作'], null, 13, false);

-- =====================================================
-- 6. 娱乐休闲类 (10个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 视频平台
('哔哩哔哩', 'https://www.bilibili.com', '中国年轻人的文化社区', '娱乐休闲', ARRAY['视频', '动漫', '娱乐'], null, 1, true),
('爱奇艺', 'https://www.iqiyi.com', '中国领先的在线视频平台', '娱乐休闲', ARRAY['视频', '影视', '综艺'], null, 2, false),
('腾讯视频', 'https://v.qq.com', '腾讯旗下视频平台', '娱乐休闲', ARRAY['视频', '影视', '腾讯'], null, 3, false),
('优酷', 'https://www.youku.com', '阿里旗下视频平台', '娱乐休闲', ARRAY['视频', '影视', '阿里'], null, 4, false),
('抖音', 'https://www.douyin.com', '短视频分享平台', '娱乐休闲', ARRAY['短视频', '娱乐', '字节'], null, 5, true),

-- 国际平台
('Netflix', 'https://www.netflix.com', '全球流媒体巨头', '娱乐休闲', ARRAY['流媒体', '影视', '美剧'], null, 6, false),
('YouTube', 'https://www.youtube.com', '全球最大视频分享平台', '娱乐休闲', ARRAY['视频', '分享', '全球'], null, 7, false),
('Spotify', 'https://www.spotify.com', '全球音乐流媒体平台', '娱乐休闲', ARRAY['音乐', '流媒体', '播客'], null, 8, false),

-- 音乐平台
('网易云音乐', 'https://music.163.com', '网易旗下音乐产品', '娱乐休闲', ARRAY['音乐', '播放器', '网易'], null, 9, true),
('QQ音乐', 'https://y.qq.com', '腾讯旗下音乐平台', '娱乐休闲', ARRAY['音乐', '播放器', '腾讯'], null, 10, false);

-- =====================================================
-- 7. 新闻资讯类 (10个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 科技媒体
('36氪', 'https://36kr.com', '领先的科技创投媒体', '新闻资讯', ARRAY['科技', '创投', '新闻'], null, 1, true),
('虎嗅', 'https://www.huxiu.com', '个性化商业资讯平台', '新闻资讯', ARRAY['科技', '商业', '深度'], null, 2, true),
('钛媒体', 'https://www.tmtpost.com', 'TMT领域科技媒体', '新闻资讯', ARRAY['科技', '媒体', 'TMT'], null, 3, false),
('少数派', 'https://sspai.com', '高品质数字生活指南', '新闻资讯', ARRAY['数码', '效率', '评测'], null, 4, true),
('IT之家', 'https://www.ithome.com', 'IT科技资讯门户', '新闻资讯', ARRAY['科技', 'IT', '数码'], null, 5, false),

-- 内容社区
('知乎', 'https://www.zhihu.com', '中文互联网问答社区', '新闻资讯', ARRAY['问答', '社区', '知识'], null, 6, true),
('小红书', 'https://www.xiaohongshu.com', '生活方式分享社区', '新闻资讯', ARRAY['分享', '种草', '社区'], null, 7, true),
('微博', 'https://weibo.com', '中国领先的社交媒体平台', '新闻资讯', ARRAY['社交', '新闻', '热搜'], null, 8, false),
('今日头条', 'https://www.toutiao.com', '个性化推荐资讯平台', '新闻资讯', ARRAY['新闻', '推荐', '字节'], null, 9, false),
('腾讯新闻', 'https://news.qq.com', '腾讯新闻资讯平台', '新闻资讯', ARRAY['新闻', '资讯', '腾讯'], null, 10, false);

-- =====================================================
-- 8. 社交媒体类 (10个)
-- =====================================================

INSERT INTO nav_links (name, url, description, category, tags, icon_url, sort_order, is_featured) VALUES
-- 国内社交
('微信', 'https://weixin.qq.com', '中国最大的即时通讯工具', '社交媒体', ARRAY['即时通讯', '社交', '腾讯'], null, 1, true),
('QQ', 'https://im.qq.com', '腾讯即时通讯软件', '社交媒体', ARRAY['即时通讯', '社交', '腾讯'], null, 2, false),
('微博', 'https://weibo.com', '中国领先的社交媒体', '社交媒体', ARRAY['社交', '微博', '新浪'], null, 3, true),
('小红书', 'https://www.xiaohongshu.com', '生活方式社区', '社交媒体', ARRAY['社交', '分享', '种草'], null, 4, true),
('知乎', 'https://www.zhihu.com', '问答社区', '社交媒体', ARRAY['问答', '社区', '知识'], null, 5, false),

-- 国际社交
('X (Twitter)', 'https://x.com', '全球实时信息网络', '社交媒体', ARRAY['社交', '推特', '全球'], null, 6, false),
('Instagram', 'https://www.instagram.com', '图片和视频分享平台', '社交媒体', ARRAY['社交', '图片', 'Meta'], null, 7, false),
('LinkedIn', 'https://www.linkedin.com', '全球职业社交网络', '社交媒体', ARRAY['职业', '社交', '求职'], null, 8, false),
('Reddit', 'https://www.reddit.com', '全球社区讨论平台', '社交媒体', ARRAY['社区', '讨论', '全球'], null, 9, false),
('Discord', 'https://discord.com', '游戏和社区聊天平台', '社交媒体', ARRAY['聊天', '游戏', '社区'], null, 10, true);

-- =====================================================
-- 插入完成提示
-- =====================================================
-- 总计插入 94 个网站链接
-- 涵盖 8 大分类，每个分类 10-15 个精选网站
-- 包含国内外主流平台，确保实用性和可访问性
