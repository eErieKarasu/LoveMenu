/* ============================================
   LoveMenu — App Logic
   ============================================ */

// === CONSTANTS ===
const PASSWORD = '240520';
const EMOJIS = ['🍅', '🥩', '🐟', '🍜', '🥗', '🍲', '🥘', '🍱', '🍣', '🍛',
    '🥚', '🥦', '🧆', '🍖', '🦐', '🥕', '🍄', '🧀', '🌽', '🥟'];
const PAGE_ORDER = ['hall', 'today', 'history', 'add'];

// === STATE ===
const state = {
    dishes: [],
    todayMenu: null,          // { date, status, items[] }
    selectedEmoji: '🍅',
    currentPage: 'hall',
    selectedHistoryDate: '',
    searchQuery: '',
};

// ============================================
// UTILS
// ============================================
function getToday() {
    // Natural day based on device local time
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function daysSince(dateStr) {
    if (!dateStr) return null;
    const past = new Date(dateStr + 'T00:00:00');
    const today = new Date(getToday() + 'T00:00:00');
    return Math.round((today - past) / 86400000);
}

function getTimeBadge(lastDate) {
    if (!lastDate) return { text: '✨ 还没做过', cls: 'badge-new' };
    const d = daysSince(lastDate);
    if (d === 0) return { text: '今天做的', cls: 'badge-today' };
    if (d === 1) return { text: '昨天', cls: 'badge-recent' };
    if (d <= 3) return { text: `${d}天前`, cls: 'badge-recent' };
    if (d <= 7) return { text: `${d}天前`, cls: 'badge-medium' };
    return { text: `${d}天前`, cls: 'badge-old' };
}

function formatDateLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const M = d.getMonth() + 1;
    const D = d.getDate();
    const w = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
    return `${M}月${D}日 ${w}`;
}

// ============================================
// AUTH
// ============================================
function checkAuth() {
    if (sessionStorage.getItem('lm_auth') === '1') {
        document.getElementById('auth-gate').classList.add('hidden');
        showApp();
    }
}

function handleLogin() {
    const input = document.getElementById('password-input');
    const error = document.getElementById('auth-error');
    if (input.value === PASSWORD) {
        sessionStorage.setItem('lm_auth', '1');
        const gate = document.getElementById('auth-gate');
        gate.classList.add('fade-out');
        setTimeout(() => { gate.classList.add('hidden'); showApp(); }, 420);
    } else {
        input.classList.remove('shake');
        void input.offsetWidth; // reflow to restart animation
        input.classList.add('shake');
        error.textContent = '密码不对哦，再试试～';
        input.value = '';
        setTimeout(() => { input.classList.remove('shake'); }, 550);
    }
}

function showApp() {
    const app = document.getElementById('app');
    app.classList.remove('hidden');
    app.classList.add('fade-in');
    state.selectedHistoryDate = getToday();
    init();
}

// ============================================
// NAVIGATION
// ============================================
function navigateTo(page) {
    if (page === state.currentPage) return;
    const prev = state.currentPage;
    state.currentPage = page;

    const prevEl = document.getElementById(`page-${prev}`);
    const nextEl = document.getElementById(`page-${page}`);
    const goRight = PAGE_ORDER.indexOf(page) > PAGE_ORDER.indexOf(prev);

    // Nav buttons
    document.querySelectorAll('.nav-item').forEach(b =>
        b.classList.toggle('nav-active', b.dataset.page === page)
    );

    // Exit animation
    prevEl.classList.remove('page-active');
    prevEl.classList.add(goRight ? 'page-exit-left' : 'page-exit-right');

    // Enter animation
    nextEl.classList.add(goRight ? 'page-from-right' : 'page-from-left');
    nextEl.classList.remove('page-active');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            nextEl.classList.remove('page-from-right', 'page-from-left');
            nextEl.classList.add('page-active');
        });
    });

    setTimeout(() => {
        prevEl.classList.remove('page-exit-left', 'page-exit-right');
    }, 380);

    // Load data for page
    if (page === 'today') loadToday();
    if (page === 'history') renderDateStrip();
    if (page === 'add') initAddPage();
}

// ============================================
// HALL PAGE
// ============================================
async function loadDishes() {
    document.getElementById('hall-loading').classList.remove('hidden');
    document.getElementById('dish-grid').classList.add('hidden');

    const { data, error } = await supabaseClient
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });

    document.getElementById('hall-loading').classList.add('hidden');

    if (error) { console.error('loadDishes:', error); return; }
    state.dishes = data || [];
    renderDishes();
}

function renderDishes() {
    const grid = document.getElementById('dish-grid');
    const emptyEl = document.getElementById('hall-empty');
    const todayIds = new Set((state.todayMenu?.items || []).map(i => i.dish_id));
    const q = state.searchQuery.trim();

    const filtered = q
        ? state.dishes.filter(d => d.name.includes(q))
        : state.dishes;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        grid.classList.add('hidden');
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    grid.classList.remove('hidden');

    grid.innerHTML = filtered.map((dish, i) => {
        const badge = getTimeBadge(dish.last_cooked_date);
        const added = todayIds.has(dish.id);
        const delay = `${i * 0.045}s`;
        const safeEmoji = dish.emoji || '🍽️';
        return `
      <div class="dish-card" style="animation-delay:${delay}" data-id="${dish.id}">
        <span class="dish-badge ${badge.cls}">${badge.text}</span>
        <span class="dish-emoji">${safeEmoji}</span>
        <span class="dish-name">${dish.name}</span>
        <button
          class="dish-add-btn ${added ? 'added' : ''}"
          onclick="addToToday('${dish.id}','${dish.name.replace(/'/g, "\\'")}','${safeEmoji}')"
          ${added ? 'disabled' : ''}
          aria-label="${added ? '已加入今日' : '加入今日菜单'}"
        >${added ? '✓' : '+'}</button>
      </div>`;
    }).join('');
}

function filterDishes(q) {
    state.searchQuery = q;
    renderDishes();
}

function toggleSearch() {
    const bar = document.getElementById('search-bar');
    const hidden = bar.classList.contains('hidden');
    bar.classList.toggle('hidden', !hidden);
    if (hidden) {
        document.getElementById('search-input').focus();
    } else {
        state.searchQuery = '';
        document.getElementById('search-input').value = '';
        renderDishes();
    }
}

async function addToToday(dishId, dishName, dishEmoji) {
    const today = getToday();

    // Animate button
    const btn = document.querySelector(`.dish-card[data-id="${dishId}"] .dish-add-btn`);
    if (btn) { btn.classList.add('bounce'); setTimeout(() => btn.classList.remove('bounce'), 420); }

    // Get or create today's record
    let menu = state.todayMenu;
    if (!menu || menu.date !== today) {
        const { data, error } = await supabaseClient
            .from('daily_menus').select('*').eq('date', today).maybeSingle();
        if (error) { console.error('addToToday get:', error); return; }
        menu = data;
    }

    const items = menu ? [...(menu.items || [])] : [];
    if (items.some(i => i.dish_id === dishId)) return; // already added

    const newItems = [...items, { dish_id: dishId, dish_name: dishName, emoji: dishEmoji }];

    if (menu) {
        const { error } = await supabaseClient
            .from('daily_menus').update({ items: newItems }).eq('date', today);
        if (error) { console.error('addToToday update:', error); return; }
        state.todayMenu = { ...menu, items: newItems };
    } else {
        const { data, error } = await supabaseClient
            .from('daily_menus')
            .insert({ date: today, status: 'draft', items: newItems })
            .select().single();
        if (error) { console.error('addToToday insert:', error); return; }
        state.todayMenu = data;
    }

    renderDishes();
    updateNavBadge();
}

// ============================================
// TODAY PAGE
// ============================================
async function loadToday() {
    const today = getToday();
    document.getElementById('today-date-label').textContent = formatDateLabel(today);

    const { data, error } = await supabaseClient
        .from('daily_menus').select('*').eq('date', today).maybeSingle();

    if (error) { console.error('loadToday:', error); return; }
    state.todayMenu = data || { date: today, status: 'draft', items: [] };
    renderToday();
    updateNavBadge();
}

function renderToday() {
    const list = document.getElementById('today-list');
    const emptyEl = document.getElementById('today-empty');
    const confirmArea = document.getElementById('confirm-area');
    const confirmBtn = document.getElementById('confirm-btn');
    const confirmedEl = document.getElementById('confirmed-msg');

    const items = state.todayMenu?.items || [];
    const isCompleted = state.todayMenu?.status === 'completed';

    if (items.length === 0) {
        list.innerHTML = '';
        emptyEl.classList.remove('hidden');
        confirmArea.classList.add('hidden');
        confirmedEl.classList.add('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    list.innerHTML = items.map((item, i) => `
    <div class="today-item" style="animation-delay:${i * 0.07}s">
      <span class="today-item-emoji">${item.emoji || '🍽️'}</span>
      <span class="today-item-name">${item.dish_name}</span>
      ${!isCompleted
            ? `<button class="today-remove-btn" onclick="removeFromToday('${item.dish_id}')" aria-label="移除">✕</button>`
            : ''}
    </div>`).join('');

    if (isCompleted) {
        confirmArea.classList.add('hidden');
        confirmedEl.classList.remove('hidden');
    } else {
        confirmArea.classList.remove('hidden');
        confirmedEl.classList.add('hidden');
        confirmBtn.disabled = false;
        confirmBtn.textContent = '✅ 确认开饭！';
    }
}

async function removeFromToday(dishId) {
    const today = getToday();
    const newItems = (state.todayMenu?.items || []).filter(i => i.dish_id !== dishId);

    const { error } = await supabaseClient
        .from('daily_menus').update({ items: newItems }).eq('date', today);

    if (error) { console.error('removeFromToday:', error); return; }

    state.todayMenu = { ...state.todayMenu, items: newItems };
    renderToday();
    renderDishes();
    updateNavBadge();
}

async function confirmMeal() {
    const today = getToday();
    const items = state.todayMenu?.items || [];
    if (!items.length) return;

    const btn = document.getElementById('confirm-btn');
    btn.disabled = true;
    btn.textContent = '记录中…';

    // 1. Mark menu as completed
    const { error: menuErr } = await supabaseClient
        .from('daily_menus')
        .upsert({ date: today, status: 'completed', items }, { onConflict: 'date' });
    if (menuErr) {
        console.error('confirmMeal menu:', menuErr);
        btn.disabled = false; btn.textContent = '✅ 确认开饭！'; return;
    }

    // 2. Update last_cooked_date for all dishes in the menu
    const ids = items.map(i => i.dish_id);
    const { error: dishErr } = await supabaseClient
        .from('dishes').update({ last_cooked_date: today }).in('id', ids);
    if (dishErr) console.error('confirmMeal dishes:', dishErr);

    // Update local state
    state.todayMenu = { ...state.todayMenu, status: 'completed' };

    // Refresh dishes to update time badges
    await loadDishes();
    renderToday();
    updateNavBadge();
    showCelebration();
}

function updateNavBadge() {
    const badge = document.getElementById('nav-badge');
    const count = (state.todayMenu?.items || []).length;
    const done = state.todayMenu?.status === 'completed';
    if (count > 0 && !done) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ============================================
// HISTORY PAGE
// ============================================
function renderDateStrip() {
    const strip = document.getElementById('date-strip');
    const today = new Date();
    const chips = [];

    for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const isToday = dateStr === getToday();
        const isSelected = dateStr === state.selectedHistoryDate;
        const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];

        chips.push(`
      <button class="date-chip ${isSelected ? 'active' : ''}"
        data-date="${dateStr}" onclick="selectHistoryDate('${dateStr}')"
        aria-label="${dateStr}">
        <span class="date-chip-week">周${week}</span>
        <span class="date-chip-day">${isToday ? '今' : d.getDate()}</span>
        <span class="date-chip-month">${d.getMonth() + 1}月</span>
      </button>`);
    }

    strip.innerHTML = chips.join('');

    // Scroll selected chip into view
    requestAnimationFrame(() => {
        const active = strip.querySelector('.date-chip.active');
        if (active) active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });

    loadHistory(state.selectedHistoryDate);
}

function selectHistoryDate(date) {
    state.selectedHistoryDate = date;
    document.querySelectorAll('.date-chip').forEach(c =>
        c.classList.toggle('active', c.dataset.date === date)
    );
    loadHistory(date);
}

async function loadHistory(date) {
    const list = document.getElementById('history-list');
    const emptyEl = document.getElementById('history-empty');

    list.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-3);font-size:13px">加载中…</div>';
    emptyEl.classList.add('hidden');

    const { data, error } = await supabaseClient
        .from('daily_menus').select('*').eq('date', date).maybeSingle();

    if (error) { console.error('loadHistory:', error); return; }

    if (!data || !data.items || data.items.length === 0) {
        list.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    const badgeHtml = data.status === 'completed'
        ? '<span class="status-badge completed">已打卡 ✅</span>'
        : '<span class="status-badge draft">草稿 📝</span>';

    list.innerHTML = `<div class="history-header">${badgeHtml}</div>` +
        data.items.map((item, i) => `
      <div class="history-item" style="animation-delay:${i * 0.07}s">
        <span class="history-item-emoji">${item.emoji || '🍽️'}</span>
        <span class="history-item-name">${item.dish_name}</span>
      </div>`).join('');
}

// ============================================
// ADD DISH PAGE
// ============================================
function initAddPage() {
    const picker = document.getElementById('emoji-picker');
    if (picker.childElementCount > 0) return;

    picker.innerHTML = EMOJIS.map(e => `
    <button class="emoji-btn ${e === state.selectedEmoji ? 'selected' : ''}"
      onclick="selectEmoji('${e}')" aria-label="${e}">${e}</button>`).join('');
}

function selectEmoji(emoji) {
    state.selectedEmoji = emoji;
    document.querySelectorAll('.emoji-btn').forEach(b =>
        b.classList.toggle('selected', b.textContent.trim() === emoji)
    );
}

async function saveDish() {
    const nameInput = document.getElementById('dish-name-input');
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.classList.remove('shake');
        void nameInput.offsetWidth;
        nameInput.classList.add('shake');
        setTimeout(() => nameInput.classList.remove('shake'), 550);
        return;
    }

    const btn = document.getElementById('save-dish-btn');
    btn.disabled = true; btn.textContent = '保存中…';

    const { error } = await supabaseClient.from('dishes').insert({
        name,
        emoji: state.selectedEmoji,
        created_at: getToday(),
        last_cooked_date: null,
    });

    btn.disabled = false; btn.textContent = '保存菜品 ✨';

    if (error) { console.error('saveDish:', error); return; }

    nameInput.value = '';

    const successEl = document.getElementById('save-success');
    successEl.classList.remove('hidden');
    setTimeout(() => successEl.classList.add('hidden'), 2200);

    // Reload dishes in background
    loadDishes();
}

// ============================================
// CELEBRATION
// ============================================
function showCelebration() {
    const overlay = document.getElementById('celebration');
    const container = document.getElementById('particles');
    const SYMBOLS = ['❤️', '🧡', '💛', '🍽️', '🎉', '✨', '🥳', '💚', '💜', '🌟'];

    overlay.classList.remove('hidden');
    container.innerHTML = '';

    for (let i = 0; i < 28; i++) {
        const el = document.createElement('div');
        el.className = 'heart-particle';
        el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        el.style.left = `${Math.random() * 100}vw`;
        el.style.fontSize = `${Math.random() * 22 + 14}px`;
        el.style.animationDelay = `${Math.random() * 1.4}s`;
        el.style.animationDuration = `${Math.random() * 2 + 2.2}s`;
        container.appendChild(el);
    }

    setTimeout(() => {
        overlay.classList.add('hidden');
        container.innerHTML = '';
    }, 4200);
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================
function setupRealtime() {
    supabaseClient.channel('realtime:dishes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, () => {
            loadDishes();
        }).subscribe();

    supabaseClient.channel('realtime:menus')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_menus' },
            payload => {
                const today = getToday();
                const row = payload.new || payload.old;
                if (row?.date === today) {
                    state.todayMenu = payload.new || { date: today, status: 'draft', items: [] };
                    if (state.currentPage === 'today') renderToday();
                    renderDishes();
                    updateNavBadge();
                }
            }).subscribe();
}

// ============================================
// INIT
// ============================================
async function init() {
    await Promise.all([loadDishes(), loadToday()]);
    setupRealtime();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    }
}

// ============================================
// BOOT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const pwInput = document.getElementById('password-input');
    if (pwInput) pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
    checkAuth();
});
