/**
 * UI渲染器 - 处理DOM元素渲染、工具项生成、分类菜单等
 */
class UIRenderer {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.currentCategory = 'all';
    this.faviconCache = new Map();
    this.cachedMeta = {};
    this.searchKeyword = '';
    
    // DOM元素引用
    this.categoryMenu = document.getElementById('category-menu');
    this.toolsGrid = document.getElementById('tools-grid');
    this.currentTimeEl = document.getElementById('current-time');
    this.dateInfoEl = document.getElementById('date-info');
    this.heroStatsEl = document.getElementById('hero-stats');
    this.greetingEl = document.getElementById('greeting-text');
    this.dayPeriodEl = document.getElementById('day-period');
    this.dataSourcePill = document.getElementById('data-source-pill');
    this.featuredSection = document.getElementById('featured-section');
    this.featuredGrid = document.getElementById('featured-grid');
    this.categoryChipsEl = document.getElementById('category-chips');
    this.gridMetaEl = document.getElementById('grid-meta');
    this.commandInput = document.getElementById('command-input');
    this.commandClearBtn = document.getElementById('search-clear-btn');
    this.searchHintsEl = document.getElementById('search-hints');
    this.refreshFeaturedBtn = document.getElementById('refresh-featured-btn');

    this.debouncedFilter = this.createDebounce((value) => this.filterToolsByKeyword(value), 200);
    this.initSearchControls();
    this.bindHintEvents();
    this.bindFeaturedActions();
    this.updateGreeting();
  }

  updateMenuActiveState(category) {
    if (!this.categoryMenu) return;
    const menuItems = this.categoryMenu.querySelectorAll('li');
    menuItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (
        (category === 'all' && itemCategory === 'all') ||
        itemCategory === category
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // 生成分类菜单
  generateCategoryMenu() {
    if (!this.categoryMenu) return;
    
    const { categories } = this.dataManager.getCurrentData();
    
    // 保留第一个"主页"菜单项
    const homeMenuItem = this.categoryMenu.firstElementChild;
    this.categoryMenu.innerHTML = '';
    if (homeMenuItem) {
      this.categoryMenu.appendChild(homeMenuItem);
      if (!homeMenuItem.dataset.bound) {
        homeMenuItem.dataset.bound = 'true';
        homeMenuItem.addEventListener('click', () => this.handleCategorySelection('all'));
      }
    }

    // 添加分类菜单项
    categories.forEach(category => {
      const li = document.createElement('li');
      li.setAttribute('data-category', category);

      // 根据分类名称选择合适的图标
      let iconClass = 'bi-folder';
      if (category.includes('Code') || category.includes('代码')) {
        iconClass = 'bi-code-square';
      } else if (category.includes('设计')) {
        iconClass = 'bi-palette';
      } else if (category.includes('产品')) {
        iconClass = 'bi-diagram-3';
      }

      li.innerHTML = `<i class="bi ${iconClass}"></i> ${category}`;
      li.addEventListener('click', () => this.handleCategorySelection(category));
      this.categoryMenu.appendChild(li);
    });
  }

  // 显示工具
  showTools(category) {
    if (!this.toolsGrid) return;
    
    this.currentCategory = category || 'all';
    this.updateMenuActiveState(this.currentCategory);
    this.highlightCategoryChips(this.currentCategory);

    const { navigationData = {}, categories = [] } = this.dataManager.getCurrentData();
    const hasCategory = categories.includes(this.currentCategory);
    const targetCategories = this.currentCategory === 'all' || !hasCategory
      ? categories
      : [this.currentCategory];
    if (!hasCategory && this.currentCategory !== 'all') {
      this.currentCategory = 'all';
      this.updateMenuActiveState(this.currentCategory);
      this.highlightCategoryChips(this.currentCategory);
    }

    this.toolsGrid.innerHTML = '';

    let totalCount = 0;
    targetCategories.forEach(cat => {
      const tools = (navigationData && navigationData[cat]) || [];
      totalCount += tools.length;
      tools.forEach(tool => this.addToolItem(tool, cat));
    });

    if (totalCount === 0) {
      this.renderEmptyState('这里还没有收藏，可以点击右下角的「＋」添加一个。');
    }

    this.updateGridMeta({
      mode: 'category',
      count: totalCount,
      category: this.currentCategory === 'all' ? '全部分类' : this.currentCategory
    });
  }

  // 获取网站favicon的URL
  getFaviconUrl(url) {
    try {
      // 检查url是否为对象（有些数据可能格式不正确）
      if (typeof url === 'object') {
        // 如果是对象，尝试使用link或text属性
        if (url.link && typeof url.link === 'string') {
          url = url.link;
        } else if (url.text && typeof url.text === 'string') {
          url = url.text;
        } else {
          // 如果没有可用的字符串属性，则返回null
          return null;
        }
      }

      // 确保url是字符串
      if (typeof url !== 'string' || !url.trim()) {
        return null;
      }

      // 尝试创建URL对象
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // 检查内存缓存
      const cacheKey = `favicon_${hostname}`;
      if (this.faviconCache.has(cacheKey)) {
        return this.faviconCache.get(cacheKey);
      }

      // 检查LocalStorage缓存
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const cacheData = JSON.parse(cached);
          // 检查缓存是否过期（24小时）
          if (Date.now() - cacheData.timestamp < 24 * 60 * 60 * 1000) {
            this.faviconCache.set(cacheKey, cacheData.url);
            return cacheData.url;
          }
        }
      } catch (e) {
        // 静默处理LocalStorage错误
      }

      // 使用Google的favicon服务作为主要方案
      const googleFaviconUrl = `https://www.google.com/s2/favicons?sz=48&domain_url=${url}`;

      // 预缓存到内存（使用Google服务）
      this.faviconCache.set(cacheKey, googleFaviconUrl);

      // 异步缓存到LocalStorage（不阻塞主线程）
      setTimeout(() => {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            url: googleFaviconUrl,
            timestamp: Date.now(),
            ttl: 24 * 60 * 60 * 1000 // 24小时
          }));
        } catch (e) {
          // 静默处理LocalStorage错误
        }
      }, 0);

      return googleFaviconUrl;

    } catch (e) {
      // 静默处理URL错误，返回null使用文字图标
      return null;
    }
  }

  // 生成文字图标
  generateTextIcon(name = '') {
    const element = document.createElement('div');
    element.className = 'text-icon';

    let iconText = '∞';
    const sanitizedName = (name || '').trim();
    if (sanitizedName) {
      if (/[\u4e00-\u9fa5]/.test(sanitizedName[0])) {
        iconText = sanitizedName[0];
      } else {
        const words = sanitizedName.split(/\s+/);
        if (words.length >= 2) {
          iconText = (words[0][0] + words[1][0]).toUpperCase();
        } else if (words[0].length >= 2) {
          iconText = words[0].substring(0, 2).toUpperCase();
        } else {
          iconText = words[0][0].toUpperCase();
        }
      }
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const hue = Math.floor(Math.random() * 360);
    const lightness = isDarkMode ? 80 : 90;
    element.style.backgroundColor = `hsl(${hue}, 70%, ${lightness}%)`;
    element.style.color = `hsl(${hue}, 70%, 30%)`;
    element.textContent = iconText;
    return element;
  }

  // 添加工具项
  addToolItem(tool, categoryName = '') {
    if (!tool || !this.toolsGrid) return;
    
    const toolItem = document.createElement('div');
    toolItem.className = 'tool-item glass-container hover-lift click-bounce';
    toolItem.dataset.id = tool.id || '';

    const linkElement = document.createElement('a');
    const urlString = this.extractUrl(tool.url);
    linkElement.href = urlString || '#';
    linkElement.target = '_blank';
    linkElement.rel = 'noopener noreferrer';
    if (tool.name) {
      linkElement.title = tool.name;
    }

    const header = document.createElement('div');
    header.className = 'tool-header';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'tool-icon-wrapper';
    this.renderIcon(tool, iconWrapper);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'tool-text';

    const nameRow = document.createElement('div');
    nameRow.className = 'tool-name';
    const nameText = document.createElement('span');
    nameText.textContent = tool.name || '未命名站点';
    nameRow.appendChild(nameText);

    if (tool.is_featured) {
      const badge = document.createElement('span');
      badge.className = 'badge-featured';
      badge.innerHTML = '<i class="bi bi-star-fill"></i> 精选';
      nameRow.appendChild(badge);
    }

    textWrapper.appendChild(nameRow);

    if (tool.description) {
      const desc = document.createElement('p');
      desc.className = 'tool-desc';
      desc.textContent = tool.description;
      textWrapper.appendChild(desc);
    }

    const tagElements = this.buildTagElements(tool.tags || tool.tag_list);
    if (tagElements) {
      textWrapper.appendChild(tagElements);
    }

    header.appendChild(iconWrapper);
    header.appendChild(textWrapper);

    const footer = document.createElement('div');
    footer.className = 'tool-footer';

    const linkInfo = document.createElement('span');
    linkInfo.className = 'tool-link';
    linkInfo.textContent = this.formatDomain(urlString);
    footer.appendChild(linkInfo);

    const categoryPill = document.createElement('span');
    categoryPill.className = 'tool-category-pill';
    categoryPill.textContent = categoryName || tool.category || '未分类';
    footer.appendChild(categoryPill);

    linkElement.appendChild(header);
    linkElement.appendChild(footer);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'tool-item-delete-btn';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.title = '删除网站';
    deleteBtn.dataset.toolId = tool.id || '';
    deleteBtn.dataset.toolName = tool.name || '';
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.linkManager) {
        window.linkManager.showDeleteConfirmation(tool.id || '', tool.name || '');
      }
    });

    toolItem.appendChild(linkElement);
    toolItem.appendChild(deleteBtn);
    this.toolsGrid.appendChild(toolItem);
  }

  extractUrl(rawUrl) {
    if (!rawUrl) return '';
    if (typeof rawUrl === 'string') {
      return rawUrl;
    }
    if (typeof rawUrl === 'object') {
      if (rawUrl.link && typeof rawUrl.link === 'string') {
        return rawUrl.link;
      }
      if (rawUrl.text && typeof rawUrl.text === 'string') {
        return rawUrl.text;
      }
    }
    return '';
  }

  renderIcon(tool, wrapper) {
    if (!tool || !wrapper) return;

    const iconValue = typeof tool.icon === 'string' ? tool.icon.trim() : '';
    const safeName = tool.name || '网站';

    if (iconValue) {
      if (iconValue.startsWith('http')) {
        const img = document.createElement('img');
        img.src = iconValue;
        img.alt = safeName;
        img.className = 'tool-icon';
        wrapper.appendChild(img);
        return;
      }

      if (iconValue.startsWith('bi')) {
        const icon = document.createElement('i');
        const normalized = iconValue.includes(' ')
          ? iconValue
          : `bi ${iconValue}`;
        icon.className = `${normalized.trim()} tool-icon`;
        wrapper.appendChild(icon);
        return;
      }

      const emojiIcon = this.generateTextIcon(iconValue);
      emojiIcon.textContent = iconValue;
      emojiIcon.style.backgroundColor = 'rgba(255,255,255,0.08)';
      emojiIcon.style.color = 'var(--text-color)';
      wrapper.appendChild(emojiIcon);
      return;
    }

    const faviconUrl = this.getFaviconUrl(tool.url);
    const textIcon = this.generateTextIcon(tool.name || '');

    if (faviconUrl) {
      const img = document.createElement('img');
      img.src = faviconUrl;
      img.alt = safeName;
      img.className = 'tool-icon';
      img.addEventListener('error', () => {
        img.remove();
        textIcon.style.display = 'flex';
      });
      wrapper.appendChild(img);
      textIcon.style.display = 'none';
      wrapper.appendChild(textIcon);
    } else {
      wrapper.appendChild(textIcon);
    }
  }

  buildTagElements(tags) {
    let tagList = [];
    if (Array.isArray(tags)) {
      tagList = tags;
    } else if (typeof tags === 'string') {
      tagList = tags.split(/[,，、\s]+/);
    }

    const sanitizedTags = tagList
      .map(tag => (tag || '').trim())
      .filter(tag => tag)
      .slice(0, 4);

    if (!sanitizedTags.length) {
      return null;
    }

    const container = document.createElement('div');
    container.className = 'tool-tags';
    sanitizedTags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tool-tag';
      span.textContent = tag;
      container.appendChild(span);
    });
    return container;
  }

  // 显示加载动画
  showLoadingAnimation() {
    if (!this.toolsGrid) return;
    if (this.gridMetaEl) {
      this.gridMetaEl.textContent = '正在加载导航数据...';
    }
    
    this.toolsGrid.innerHTML = `
      <div class="loading-container" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 300px;
        text-align: center;
      ">
        <div class="loading-spinner" style="
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        "></div>
        <p style="color: #666; font-size: 16px; margin: 0;">正在加载导航数据...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  // 隐藏加载动画
  hideLoadingAnimation() {
    if (!this.toolsGrid) return;
    
    const loadingContainer = this.toolsGrid.querySelector('.loading-container');
    if (loadingContainer) {
      loadingContainer.remove();
    }
  }

  // 显示错误信息
  showError(message) {
    if (!this.toolsGrid) return;
    this.toolsGrid.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'empty-state';
    const icon = document.createElement('i');
    icon.className = 'bi bi-exclamation-triangle';
    const text = document.createElement('p');
    text.textContent = message || '加载失败，请稍后重试';
    error.appendChild(icon);
    error.appendChild(text);
    this.toolsGrid.appendChild(error);
  }

  // 更新时间信息
  updateTimeInfo() {
    if (!this.currentTimeEl) return;
    
    const now = new Date();

    // 更新当前时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

    // 如果有缓存数据，使用缓存的日期信息
    const { dataCache } = this.dataManager.getCurrentData();
    if (dataCache && dataCache.dateInfo) {
      this.updateDateInfo(dataCache.dateInfo);
    } else {
      // 更新日期信息（使用静态值作为fallback）
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];
      const lunarDate = '闰六月十八'; // 示例值
      if (this.dateInfoEl) {
        this.dateInfoEl.textContent = `${month} 月 ${date} 日 ${weekday} ${lunarDate}`;
      }
    }
  }

  // 更新日期信息
  updateDateInfo(dateInfo) {
    if (this.dateInfoEl && dateInfo) {
      this.dateInfoEl.textContent = `${dateInfo.date} ${dateInfo.weekday} ${dateInfo.lunarDate}`;
    }
  }

  // 立即更新时间信息
  updateTimeInfoImmediately() {
    if (this.currentTimeEl && this.dateInfoEl) {
      const now = new Date();

      // 更新当前时间
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      this.currentTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

      // 更新日期信息
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];

      // 如果有缓存数据，使用缓存的日期信息
      const { dataCache } = this.dataManager.getCurrentData();
      if (dataCache && dataCache.dateInfo) {
        this.dateInfoEl.textContent = `${dataCache.dateInfo.date} ${dataCache.dateInfo.weekday} ${dataCache.dateInfo.lunarDate}`;
      } else {
        // 这里使用固定的农历日期，实际应用中可以使用专门的农历转换库
        const lunarDate = '闰六月十八'; // 示例值
        this.dateInfoEl.textContent = `${month} 月 ${date} 日 ${weekday} ${lunarDate}`;
      }
    }
  }

  // 获取当前分类
  getCurrentCategory() {
    return this.currentCategory;
  }

  setMeta(meta = {}) {
    this.cachedMeta = meta || {};
    this.updateDataSourceBadge();
  }

  updateDataSourceBadge() {
    if (!this.dataSourcePill) return;
    const isMock = !!this.cachedMeta.isMockData;
    this.dataSourcePill.textContent = isMock ? '离线预设数据' : 'Supabase 实时数据';
  }

  collectAllLinks() {
    const { navigationData } = this.dataManager.getCurrentData();
    if (!navigationData) return [];
    const entries = [];
    Object.keys(navigationData).forEach(category => {
      const tools = navigationData[category] || [];
      tools.forEach(tool => {
        entries.push({
          ...tool,
          __category: category
        });
      });
    });
    return entries;
  }

  updateHeroStats() {
    if (!this.heroStatsEl) return;
    const { categories = [] } = this.dataManager.getCurrentData();
    const allLinks = this.collectAllLinks();
    const featuredCount = allLinks.filter(item => item.is_featured).length;
    
    this.setStatValue('categories', categories.length);
    this.setStatValue('links', allLinks.length);
    this.setStatValue('featured', featuredCount);
  }

  setStatValue(key, value) {
    if (!this.heroStatsEl) return;
    const target = this.heroStatsEl.querySelector(`[data-stat="${key}"]`);
    if (target) {
      target.textContent = typeof value === 'number' ? value : '--';
    }
  }

  updateCategoryChips() {
    if (!this.categoryChipsEl) return;
    this.categoryChipsEl.innerHTML = '';

    const fragment = document.createDocumentFragment();
    fragment.appendChild(this.createCategoryChip('all', '全部'));

    const { categories = [] } = this.dataManager.getCurrentData();
    categories.forEach(category => {
      fragment.appendChild(this.createCategoryChip(category, category));
    });

    this.categoryChipsEl.appendChild(fragment);
    this.highlightCategoryChips(this.currentCategory);
  }

  createCategoryChip(category, label) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'category-chip';
    chip.dataset.category = category;
    chip.textContent = label;
    chip.addEventListener('click', () => this.handleCategorySelection(category));
    return chip;
  }

  highlightCategoryChips(category) {
    if (!this.categoryChipsEl) return;
    const chips = this.categoryChipsEl.querySelectorAll('.category-chip');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.category === category);
    });
  }

  renderEmptyState(message) {
    if (!this.toolsGrid) return;
    this.toolsGrid.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const icon = document.createElement('i');
    icon.className = 'bi bi-search';
    const text = document.createElement('p');
    text.textContent = message;
    empty.appendChild(icon);
    empty.appendChild(text);
    this.toolsGrid.appendChild(empty);
  }

  updateGridMeta({ mode = 'category', count = 0, category = '', keyword = '' } = {}) {
    if (!this.gridMetaEl) return;
    if (mode === 'search') {
      this.gridMetaEl.textContent = count
        ? `找到 ${count} 个与“${keyword}”相关的结果`
        : `没有找到与“${keyword}”相关的结果 · 按 Esc 退出搜索`;
    } else {
      const label = category || '全部分类';
      this.gridMetaEl.textContent = `${label} · ${count} 个链接`;
    }
  }

  renderFeaturedLinks(forceShuffle = false) {
    if (!this.featuredGrid || !this.featuredSection) return;
    const featured = this.collectAllLinks().filter(item => item.is_featured);

    if (!featured.length) {
      this.featuredGrid.innerHTML = '';
      this.featuredSection.classList.add('hidden');
      return;
    }

    const pool = forceShuffle ? this.shuffleArray(featured) : featured;
    const selection = pool.slice(0, 4);

    this.featuredGrid.innerHTML = '';
    selection.forEach(item => {
      const card = document.createElement('a');
      card.className = 'featured-card';
      card.href = this.extractUrl(item.url) || '#';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      const icon = document.createElement('div');
      icon.className = 'featured-icon';
      const favicon = this.getFaviconUrl(item.url);
      if (favicon) {
        const img = document.createElement('img');
        img.src = favicon;
        img.alt = item.name || '';
        icon.appendChild(img);
      } else {
        icon.textContent = (item.name || '✨').charAt(0);
      }

      const info = document.createElement('div');
      const name = document.createElement('p');
      name.className = 'featured-name';
      name.textContent = item.name || '未命名站点';

      const meta = document.createElement('p');
      meta.className = 'featured-meta';
      const category = item.__category || item.category || '收藏';
      const description = item.description || '点击访问看看';
      meta.textContent = `${category} · ${description}`;

      info.appendChild(name);
      info.appendChild(meta);

      card.appendChild(icon);
      card.appendChild(info);
      this.featuredGrid.appendChild(card);
    });

    this.featuredSection.classList.remove('hidden');
  }

  shuffleArray(collection) {
    const arr = [...collection];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  updateSearchHints() {
    if (!this.searchHintsEl) return;
    const tagCounts = new Map();

    this.collectAllLinks().forEach(link => {
      let tags = [];
      if (Array.isArray(link.tags)) {
        tags = link.tags;
      } else if (Array.isArray(link.tag_list)) {
        tags = link.tag_list;
      } else if (typeof link.tags === 'string') {
        tags = link.tags.split(/[,，、\s]+/);
      } else if (typeof link.tag_list === 'string') {
        tags = link.tag_list.split(/[,，、\s]+/);
      }
      tags.forEach(tag => {
        const normalized = (tag || '').trim();
        if (!normalized) return;
        const key = normalized.toLowerCase();
        const record = tagCounts.get(key) || { label: normalized, count: 0 };
        record.count += 1;
        tagCounts.set(key, record);
      });
    });

    let hints = Array.from(tagCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.label);

    if (!hints.length) {
      const { categories = [] } = this.dataManager.getCurrentData();
      hints = categories.slice(0, 4);
    }

    this.renderSearchHints(hints);
  }

  renderSearchHints(labels = []) {
    if (!this.searchHintsEl) return;
    if (!labels.length) {
      this.searchHintsEl.innerHTML = `
        <span class="hint-chip" data-hint="AI">AI 灵感</span>
        <span class="hint-chip" data-hint="设计">设计灵感</span>
        <span class="hint-chip" data-hint="工具">效率工具</span>
      `;
      return;
    }

    this.searchHintsEl.innerHTML = '';
    labels.forEach(label => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'hint-chip';
      chip.dataset.hint = label;
      chip.textContent = label;
      this.searchHintsEl.appendChild(chip);
    });
  }

  bindHintEvents() {
    if (!this.searchHintsEl) return;
    this.searchHintsEl.addEventListener('click', (event) => {
      const chip = event.target.closest('.hint-chip');
      if (!chip) return;
      const keyword = chip.dataset.hint || chip.textContent;
      if (keyword && this.commandInput) {
        this.commandInput.value = keyword;
        this.toggleClearButton(true);
        this.filterToolsByKeyword(keyword);
        this.commandInput.focus();
      }
    });
  }

  initSearchControls() {
    if (!this.commandInput) return;

    this.commandInput.addEventListener('input', (event) => {
      const value = event.target.value;
      this.toggleClearButton(!!value);
      this.debouncedFilter(value);
    });

    this.commandInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.clearSearch();
        event.target.blur();
      }
      if (event.key === 'Enter') {
        this.filterToolsByKeyword(event.target.value);
      }
    });

    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.commandInput.focus();
      }
      if (event.key === 'Escape' && this.hasActiveSearch()) {
        this.clearSearch();
      }
    });

    if (this.commandClearBtn) {
      this.commandClearBtn.addEventListener('click', () => {
        this.clearSearch();
        this.commandInput.focus();
      });
    }
  }

  toggleClearButton(visible) {
    if (!this.commandClearBtn) return;
    if (visible) {
      this.commandClearBtn.classList.add('is-visible');
    } else {
      this.commandClearBtn.classList.remove('is-visible');
    }
  }

  resetSearchState(clearInput = true) {
    this.searchKeyword = '';
    if (clearInput && this.commandInput) {
      this.commandInput.value = '';
    }
    this.toggleClearButton(false);
  }

  clearSearch() {
    if (!this.hasActiveSearch()) {
      this.resetSearchState();
      return;
    }
    this.resetSearchState();
    this.showTools(this.currentCategory || 'all');
  }

  filterToolsByKeyword(keyword) {
    if (!this.toolsGrid) return;
    const normalized = (keyword || '').trim();
    this.searchKeyword = normalized;

    if (!normalized) {
      this.resetSearchState(false);
      this.showTools(this.currentCategory || 'all');
      return;
    }

    this.toggleClearButton(true);
    const lowerKeyword = normalized.toLowerCase();
    const matches = this.collectAllLinks().filter(item => {
      const haystack = [
        item.name,
        item.description,
        item.__category,
        Array.isArray(item.tags) ? item.tags.join(' ') : item.tags
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(lowerKeyword);
    });

    this.toolsGrid.innerHTML = '';
    if (!matches.length) {
      this.renderEmptyState(`没有找到与“${normalized}”相关的内容，按 Esc 退出搜索`);
    } else {
      matches.forEach(item => this.addToolItem(item, item.__category));
    }

    this.updateGridMeta({
      mode: 'search',
      count: matches.length,
      keyword: normalized
    });
  }

  hasActiveSearch() {
    return Boolean(this.searchKeyword);
  }

  getSearchKeyword() {
    return this.searchKeyword;
  }

  handleCategorySelection(category) {
    if (this.hasActiveSearch()) {
      this.resetSearchState();
    }
    this.showTools(category);
  }

  updateGreeting() {
    if (!this.greetingEl) return;
    const hour = new Date().getHours();
    let greeting = '你好';
    let period = '白天';

    if (hour < 6) {
      greeting = '夜深了';
      period = '深夜';
    } else if (hour < 12) {
      greeting = '早安';
      period = '清晨';
    } else if (hour < 18) {
      greeting = '下午好';
      period = '午后';
    } else {
      greeting = '晚上好';
      period = '夜间';
    }

    this.greetingEl.textContent = `${greeting}，欢迎回来`;
    if (this.dayPeriodEl) {
      this.dayPeriodEl.textContent = `${period} · 保持灵感`;
    }
  }

  createDebounce(func, wait = 200) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  bindFeaturedActions() {
    if (this.refreshFeaturedBtn && !this.refreshFeaturedBtn.dataset.bound) {
      this.refreshFeaturedBtn.dataset.bound = 'true';
      this.refreshFeaturedBtn.addEventListener('click', () => this.renderFeaturedLinks(true));
    }
  }

  formatDomain(url) {
    if (!url) return '未提供链接';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch (error) {
      return url.replace(/^https?:\/\//, '').split('/')[0];
    }
  }

  refreshToolIcons() {
    if (this.hasActiveSearch()) {
      this.filterToolsByKeyword(this.searchKeyword);
    } else {
      this.showTools(this.currentCategory || 'all');
    }
  }
}

// 导出UI渲染器
window.UIRenderer = UIRenderer;
