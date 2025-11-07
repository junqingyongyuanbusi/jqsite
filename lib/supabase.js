/**
 * Supabase 客户端配置
 * 提供数据库连接和操作方法
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 验证环境变量
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('错误: 缺少 Supabase 配置');
    console.error('请在 .env 文件中设置 SUPABASE_URL 和 SUPABASE_SERVICE_KEY');
    process.exit(1);
}

// 创建 Supabase 客户端
// 使用 service_role key 以绕过 RLS（服务端使用）
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

/**
 * 导航链接相关操作
 */
const navLinksService = {
    /**
     * 获取所有导航链接
     * @param {Object} options - 查询选项
     * @returns {Promise<Array>}
     */
    async getAllLinks(options = {}) {
        try {
            let query = supabase
                .from('nav_links')
                .select('*')
                .eq('is_active', true);

            // 按分类筛选
            if (options.category) {
                query = query.eq('category', options.category);
            }

            // 按标签筛选
            if (options.tag) {
                query = query.contains('tags', [options.tag]);
            }

            // 排序
            query = query.order('sort_order', { ascending: true })
                        .order('name', { ascending: true });

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取导航链接失败:', error);
            throw error;
        }
    },

    /**
     * 按分类分组获取链接
     * @returns {Promise<Object>}
     */
    async getLinksByCategory() {
        try {
            const links = await this.getAllLinks();

            // 按分类分组
            const grouped = links.reduce((acc, link) => {
                if (!acc[link.category]) {
                    acc[link.category] = [];
                }
                acc[link.category].push(link);
                return acc;
            }, {});

            return grouped;
        } catch (error) {
            console.error('按分类获取链接失败:', error);
            throw error;
        }
    },

    /**
     * 添加新链接
     * @param {Object} linkData
     * @returns {Promise<Object>}
     */
    async addLink(linkData) {
        try {
            // 数据验证
            if (!linkData.name || !linkData.url || !linkData.category) {
                throw new Error('缺少必要字段: name, url, category');
            }

            // 格式化 URL
            if (!linkData.url.startsWith('http://') && !linkData.url.startsWith('https://')) {
                linkData.url = 'https://' + linkData.url;
            }

            const { data, error } = await supabase
                .from('nav_links')
                .insert([{
                    name: linkData.name.trim(),
                    url: linkData.url.trim(),
                    description: linkData.description?.trim() || null,
                    category: linkData.category,
                    tags: linkData.tags || [],
                    icon_url: linkData.icon_url || null,
                    sort_order: linkData.sort_order || 999,
                    is_featured: linkData.is_featured || false
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('添加链接失败:', error);
            throw error;
        }
    },

    /**
     * 更新链接
     * @param {string} id
     * @param {Object} updates
     * @returns {Promise<Object>}
     */
    async updateLink(id, updates) {
        try {
            const { data, error } = await supabase
                .from('nav_links')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('更新链接失败:', error);
            throw error;
        }
    },

    /**
     * 删除链接
     * @param {string} id
     * @returns {Promise<void>}
     */
    async deleteLink(id) {
        try {
            const { error } = await supabase
                .from('nav_links')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('删除链接失败:', error);
            throw error;
        }
    },

    /**
     * 增加点击次数
     * @param {string} id
     * @returns {Promise<void>}
     */
    async incrementClickCount(id) {
        try {
            const { error } = await supabase.rpc('increment_click_count', { link_id: id });
            if (error) throw error;
        } catch (error) {
            console.error('更新点击次数失败:', error);
            // 不抛出错误，避免影响用户体验
        }
    }
};

/**
 * 分类管理
 */
const categoriesService = {
    /**
     * 获取所有分类
     * @returns {Promise<Array>}
     */
    async getAllCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取分类失败:', error);
            throw error;
        }
    },

    /**
     * 添加分类
     * @param {Object} categoryData
     * @returns {Promise<Object>}
     */
    async addCategory(categoryData) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([categoryData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('添加分类失败:', error);
            throw error;
        }
    }
};

/**
 * 访问统计
 */
const analyticsService = {
    /**
     * 记录点击
     * @param {string} linkId
     * @param {Object} metadata
     * @returns {Promise<void>}
     */
    async trackClick(linkId, metadata = {}) {
        try {
            const { error } = await supabase
                .from('analytics')
                .insert([{
                    link_id: linkId,
                    visitor_id: metadata.visitorId || null,
                    user_agent: metadata.userAgent || null,
                    referer: metadata.referer || null
                }]);

            if (error) throw error;

            // 同时更新链接的点击次数
            await navLinksService.incrementClickCount(linkId);
        } catch (error) {
            console.error('记录点击失败:', error);
            // 不抛出错误，避免影响用户体验
        }
    },

    /**
     * 获取热门链接
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getPopularLinks(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('popular_links')
                .select('*')
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取热门链接失败:', error);
            throw error;
        }
    },

    /**
     * 获取分类统计
     * @returns {Promise<Array>}
     */
    async getCategoryStats() {
        try {
            const { data, error } = await supabase
                .from('category_stats')
                .select('*');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取分类统计失败:', error);
            throw error;
        }
    }
};

/**
 * 搜索功能
 */
const searchService = {
    /**
     * 搜索链接
     * @param {string} keyword
     * @returns {Promise<Array>}
     */
    async searchLinks(keyword) {
        try {
            if (!keyword || keyword.trim().length < 2) {
                return [];
            }

            const searchTerm = `%${keyword.trim()}%`;

            const { data, error } = await supabase
                .from('nav_links')
                .select('*')
                .eq('is_active', true)
                .or(`name.ilike.${searchTerm},description.ilike.${searchTerm},url.ilike.${searchTerm}`)
                .order('click_count', { ascending: false })
                .limit(20);

            if (error) throw error;

            // 记录搜索历史
            await this.recordSearchHistory(keyword.trim());

            return data || [];
        } catch (error) {
            console.error('搜索失败:', error);
            throw error;
        }
    },

    /**
     * 记录搜索历史
     * @param {string} keyword
     * @returns {Promise<void>}
     */
    async recordSearchHistory(keyword) {
        try {
            // 先检查是否存在
            const { data: existing } = await supabase
                .from('search_history')
                .select('id, count')
                .eq('keyword', keyword)
                .single();

            if (existing) {
                // 更新计数
                await supabase
                    .from('search_history')
                    .update({
                        count: existing.count + 1,
                        last_searched: new Date()
                    })
                    .eq('id', existing.id);
            } else {
                // 新建记录
                await supabase
                    .from('search_history')
                    .insert([{ keyword }]);
            }
        } catch (error) {
            // 静默失败，不影响搜索功能
            console.error('记录搜索历史失败:', error);
        }
    },

    /**
     * 获取热门搜索
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getPopularSearches(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('search_history')
                .select('keyword, count')
                .order('count', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('获取热门搜索失败:', error);
            return [];
        }
    }
};

/**
 * 实时订阅功能
 */
const realtimeService = {
    /**
     * 订阅链接变化
     * @param {Function} callback
     * @returns {Object} subscription
     */
    subscribeToLinks(callback) {
        const subscription = supabase
            .channel('nav_links_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'nav_links'
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return subscription;
    },

    /**
     * 取消订阅
     * @param {Object} subscription
     */
    unsubscribe(subscription) {
        if (subscription) {
            supabase.removeChannel(subscription);
        }
    }
};

// 创建存储过程（用于原子操作）
const createStoredProcedures = async () => {
    try {
        // 创建增加点击次数的存储过程
        await supabase.rpc('create_function', {
            function_name: 'increment_click_count',
            function_body: `
                CREATE OR REPLACE FUNCTION increment_click_count(link_id UUID)
                RETURNS void AS $$
                BEGIN
                    UPDATE nav_links
                    SET click_count = click_count + 1
                    WHERE id = link_id;
                END;
                $$ LANGUAGE plpgsql;
            `
        });
    } catch (error) {
        console.error('创建存储过程失败:', error);
    }
};

module.exports = {
    supabase,
    navLinksService,
    categoriesService,
    analyticsService,
    searchService,
    realtimeService,
    createStoredProcedures
};