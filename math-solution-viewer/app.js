/**
 * MathArchive - 数学問題・模範解答アーカイブ
 * Application Logic
 */

// ==========================================================
// 定数 & 初期データ
// ==========================================================
const STORAGE_KEY = 'math_archive_questions_v1';
const STATUS_STORAGE_KEY = 'math_archive_status_v1';
const THEME_STORAGE_KEY = 'math_archive_theme_v1';
const GITHUB_CONFIG_KEY = 'math_archive_github_config_v1';

// file:// プロトコル等で fetch が制限された場合のフォールバック用サンプルデータ
const FALLBACK_QUESTIONS = [
  {
    "id": "sample-1",
    "title": "定積分と区分求積法の応用",
    "category": "数学III・C",
    "difficulty": 3,
    "tags": ["微積分", "極限", "区分求積法", "頻出"],
    "problem": "次の極限値を求めよ。\n\n$$\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{n}{n^2 + k^2}$$",
    "hint": "式全体を $\\frac{1}{n} f\\left(\\frac{k}{n}\\right)$ の形に変形し、区分求積法の公式\n$$\\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} f\\left(\\frac{k}{n}\\right) = \\int_{0}^{1} f(x) dx$$\nを利用することを考えましょう。",
    "solution": "### 【解答】\n\n与えられた極限の一般項の分母・分子を $n^2$ で割ると、\n\n$$\\frac{n}{n^2 + k^2} = \\frac{1}{n} \\cdot \\frac{1}{1 + \\left(\\frac{k}{n}\\right)^2}$$\n\nと変形できる。\n\nよって、求める極限は次のように表される：\n\n$$\\lim_{n \\to \\infty} \\sum_{k=1}^{n} \\frac{n}{n^2 + k^2} = \\lim_{n \\to \\infty} \\frac{1}{n} \\sum_{k=1}^{n} \\frac{1}{1 + \\left(\\frac{k}{n}\\right)^2}$$\n\n区分求積法の公式より、この極限は定積分に帰着される：\n\n$$= \\int_{0}^{1} \\frac{1}{1 + x^2} dx$$\n\nここで、$x = \\tan \\theta$ と置換すると、$dx = \\frac{1}{\\cos^2 \\theta} d\\theta$\n\n積分区間は $x: 0 \\to 1$ のとき $\\theta: 0 \\to \\frac{\\pi}{4}$ となるので、\n\n$$\\int_{0}^{1} \\frac{1}{1 + x^2} dx = \\int_{0}^{\\frac{\\pi}{4}} 1 \\, d\\theta = \\left[ \\theta \\right]_{0}^{\\frac{\\pi}{4}} = \\frac{\\pi}{4}$$\n\n**答:** $\\displaystyle \\frac{\\pi}{4}$",
    "alternative": "#### 【別解・ポイント】\n- $\\int \\frac{1}{1+x^2} dx = \\arctan(x) + C$ を既知として使ってよい場合、\n  $$[\\arctan(x)]_0^1 = \\arctan(1) - \\arctan(0) = \\frac{\\pi}{4}$$\n  と直ちに計算できます。",
    "createdAt": "2026-11-14T09:00:00.000Z",
    "updatedAt": "2026-11-14T09:00:00.000Z"
  },
  {
    "id": "sample-2",
    "title": "放物線と接線で囲まれる面積（1/12公式の証明と利用）",
    "category": "数学II・B",
    "difficulty": 2,
    "tags": ["微分積分", "面積", "1/12公式"],
    "problem": "放物線 $C: y = x^2$ と、その上の2点 $P(-1, 1)$, $Q(2, 4)$ における接線 $\\ell_1, \\ell_2$ を考える。\n\n1. 接線 $\\ell_1, \\ell_2$ の方程式およびその交点の座標を求めよ。\n2. 放物線 $C$ と2本の接線 $\\ell_1, \\ell_2$ で囲まれた図形の面積 $S$ を求めよ。",
    "hint": "2本の接線の交点の $x$ 座標は、2つの接点の $x$ 座標の中点になります。\n面積の計算では $(x - \\alpha)^2$ の積分形を活用すると計算が格段に楽になります。",
    "solution": "### 【解答】\n\n$y = x^2$ より $y' = 2x$ である。\n\n#### (1) 接線の方程式と交点\n- $\\ell_1: y = -2x - 1$\n- $\\ell_2: y = 4x - 4$\n\n連立すると交点座標は $\\displaystyle \\left( \\frac{1}{2}, -2 \\right)$ である。\n\n#### (2) 囲まれた面積 $S$\n$$S = \\int_{-1}^{\\frac{1}{2}} (x + 1)^2 dx + \\int_{\\frac{1}{2}}^{2} (x - 2)^2 dx = \\frac{9}{8} + \\frac{9}{8} = \\frac{9}{4}$$\n\n**答:** (1) 交点 $\\left(\\frac{1}{2}, -2\\right)$　(2) $S = \\displaystyle \\frac{9}{4}$",
    "alternative": "#### 【1/12公式による検算】\n$$S = \\frac{|a|}{12} (\\beta - \\alpha)^3 = \\frac{1}{12} (2 - (-1))^3 = \\frac{27}{12} = \\frac{9}{4}$$",
    "createdAt": "2026-11-14T09:15:00.000Z",
    "updatedAt": "2026-11-14T09:15:00.000Z"
  },
  {
    "id": "sample-3",
    "title": "2次正方行列の固有値と対角化",
    "category": "線形代数",
    "difficulty": 3,
    "tags": ["線形代数", "固有値", "対角化", "大学数学"],
    "problem": "次の行列 $A$ の固有値と固有ベクトルを求め、対角化可能である場合は対角化せよ。\n\n$$A = \\begin{pmatrix} 4 & 2 \\\\ 1 & 3 \\end{pmatrix}$$",
    "hint": "特性方程式 $\\det(A - \\lambda I) = 0$ を解いて固有値 $\\lambda$ を求めます。",
    "solution": "### 【解答】\n\n特性方程式 $\\det(A - \\lambda I) = 0$ より、\n$$(\\lambda - 2)(\\lambda - 5) = 0 \\implies \\lambda = 2, 5$$\n\n- $\\lambda = 2$ の固有ベクトル: $\\mathbf{v}_1 = c_1 \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}$\n- $\\lambda = 5$ の固有ベクトル: $\\mathbf{v}_2 = c_2 \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}$\n\n変換行列 $P = \\begin{pmatrix} 1 & 2 \\\\ -1 & 1 \\end{pmatrix}$ とおくと、\n$$P^{-1}AP = \\begin{pmatrix} 2 & 0 \\\\ 0 & 5 \\end{pmatrix}$$\n\n**答:** 固有値 $\\lambda = 2, 5$, 対角化 $P^{-1}AP = \\begin{pmatrix} 2 & 0 \\\\ 0 & 5 \\end{pmatrix}$",
    "alternative": "",
    "createdAt": "2026-11-14T09:30:00.000Z",
    "updatedAt": "2026-11-14T09:30:00.000Z"
  }
];

// ==========================================================
// 状態管理 (App State)
// ==========================================================
class MathArchiveApp {
  constructor() {
    this.questions = [];
    this.statusMap = {}; // { [questionId]: 'unlearned' | 'review' | 'mastered' }
    this.currentMode = 'view'; // 'view' (一覧) | 'detail' (単問閲覧) | 'admin' (管理)
    this.currentQuestionId = null;
    this.activeTag = null;
    this.editingId = null;
    this.debounceTimers = {};

    this.init();
  }

  async init() {
    this.initTheme();
    this.loadGitHubConfig();
    await this.loadData();
    this.bindEvents();
    this.render();
    this.handleHashChange();
  }

  // --------------------------------------------------------
  // テーマ初期化 (ダーク / ライト)
  // --------------------------------------------------------
  initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      document.getElementById('theme-icon')?.setAttribute('data-lucide', 'sun');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      document.getElementById('theme-icon')?.setAttribute('data-lucide', 'moon');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.refreshIcons();
  }

  toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    this.setTheme(isDark ? 'light' : 'dark');
  }

  // --------------------------------------------------------
  // データ読み込み & 保存
  // --------------------------------------------------------
  async loadData() {
    // 1. 理解度ステータスをロード
    try {
      const storedStatus = localStorage.getItem(STATUS_STORAGE_KEY);
      this.statusMap = storedStatus ? JSON.parse(storedStatus) : {};
    } catch (e) {
      this.statusMap = {};
    }

    // 2. ローカルデータを取得
    let localQuestions = null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localQuestions = parsed;
        }
      } catch (e) {
        console.warn('LocalStorage data parse failed:', e);
      }
    }

    // 3. questions.json から最新データを取得してマージを試みる（GitHub Pages公開時に他端末の変更を自動反映）
    try {
      const res = await fetch('questions.json?t=' + Date.now());
      if (res.ok) {
        const remoteData = await res.json();
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          if (!localQuestions) {
            this.questions = remoteData;
          } else {
            // リモートとローカルをIDベースで新しい方を優先マージ
            const map = new Map();
            localQuestions.forEach(q => map.set(q.id, q));
            remoteData.forEach(rq => {
              const existing = map.get(rq.id);
              if (!existing || new Date(rq.updatedAt || 0) >= new Date(existing.updatedAt || 0)) {
                map.set(rq.id, rq);
              }
            });
            this.questions = Array.from(map.values());
          }
          this.saveQuestions(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fetch questions.json skipped or failed:', e);
    }

    if (localQuestions) {
      this.questions = localQuestions;
      return;
    }

    // フォールバック
    this.questions = [...FALLBACK_QUESTIONS];
    this.saveQuestions(false);
  }

  saveQuestions(triggerAutoSync = false) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.questions));
    if (triggerAutoSync && this.githubConfig?.autoSync && this.githubConfig?.repo && this.githubConfig?.token) {
      this.pushToGitHub(true);
    }
  }

  saveStatus() {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(this.statusMap));
  }

  // --------------------------------------------------------
  // イベント登録
  // --------------------------------------------------------
  bindEvents() {
    // ロゴクリックで常に問題一覧へ戻る
    document.querySelector('.logo-area')?.addEventListener('click', () => {
      this.navigateTo('view');
    });

    // URLハッシュ変更（ブラウザの戻る・進む対応）
    window.addEventListener('hashchange', () => this.handleHashChange());

    // テーマ切り替え
    document.getElementById('btn-theme-toggle').addEventListener('click', () => this.toggleTheme());

    // ビュー / 管理モード切り替え
    document.getElementById('btn-toggle-view').addEventListener('click', () => {
      this.toggleMode();
    });

    // 検索 & フィルター
    const searchInput = document.getElementById('global-search');
    const clearBtn = document.getElementById('clear-search');
    searchInput.addEventListener('input', (e) => {
      clearBtn.style.display = e.target.value ? 'flex' : 'none';
      if (this.currentMode !== 'view') {
        this.setMode('view', false);
      }
      this.renderQuestionList();
    });
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      this.renderQuestionList();
      searchInput.focus();
    });

    document.getElementById('filter-category').addEventListener('change', () => this.renderQuestionList());
    document.getElementById('filter-difficulty').addEventListener('change', () => this.renderQuestionList());
    document.getElementById('filter-status').addEventListener('change', () => this.renderQuestionList());
    document.getElementById('sort-order').addEventListener('change', () => this.renderQuestionList());

    // 単問閲覧ページ内のボタン
    document.getElementById('btn-back-to-list')?.addEventListener('click', () => this.navigateTo('view'));
    document.getElementById('btn-back-to-list-bottom')?.addEventListener('click', () => this.navigateTo('view'));
    document.getElementById('btn-detail-random')?.addEventListener('click', () => this.openRandomQuestionPage());
    document.getElementById('btn-detail-edit')?.addEventListener('click', () => {
      if (this.currentQuestionId) {
        this.editQuestion(this.currentQuestionId);
      }
    });

    // ランダム出題（単問閲覧ページへ直接ジャンプ）
    document.getElementById('btn-random').addEventListener('click', () => this.openRandomQuestionPage());
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeRandomModal());
    document.getElementById('btn-close-modal-bottom')?.addEventListener('click', () => this.closeRandomModal());
    document.getElementById('btn-next-random')?.addEventListener('click', () => this.showRandomQuestion());
    document.querySelector('.modal-backdrop')?.addEventListener('click', () => this.closeRandomModal());

    // 空状態からの追加ボタン
    document.getElementById('btn-empty-add').addEventListener('click', () => {
      this.navigateTo('admin');
      this.setAdminTab('editor');
    });

    // 管理モードのタブ切り替え
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = tab.getAttribute('data-tab');
        this.setAdminTab(tabName);
      });
    });

    // 数式ツールバーボタン
    document.querySelectorAll('.btn-math').forEach(btn => {
      btn.addEventListener('click', () => {
        const insertText = btn.getAttribute('data-insert');
        this.insertMathSnippet(insertText);
      });
    });

    // エディタのリアルタイムプレビュー
    this.bindEditorPreview('form-problem', 'preview-problem');
    this.bindEditorPreview('form-hint', 'preview-hint');
    this.bindEditorPreview('form-solution', 'preview-solution');
    this.bindEditorPreview('form-alternative', 'preview-alternative');

    // フォーム送信
    document.getElementById('question-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // フォームキャンセル
    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
      const targetId = this.editingId;
      this.resetForm();
      if (targetId) {
        this.openQuestionDetail(targetId);
      } else {
        this.navigateTo('view');
      }
    });

    // データ管理ボタン群
    document.getElementById('btn-save-gh-config')?.addEventListener('click', () => this.saveGitHubConfig());
    document.getElementById('btn-push-gh')?.addEventListener('click', () => this.pushToGitHub(false));
    document.getElementById('btn-pull-gh')?.addEventListener('click', () => this.pullFromGitHub());
    document.getElementById('btn-export-github-json').addEventListener('click', () => this.exportGitHubJson());
    document.getElementById('btn-backup-export').addEventListener('click', () => this.exportBackup());
    document.getElementById('file-import-json').addEventListener('change', (e) => this.importBackup(e));
    document.getElementById('btn-reload-samples').addEventListener('click', () => this.reloadSamples());
    document.getElementById('btn-reset-all').addEventListener('click', () => this.resetAllData());
  }

  // --------------------------------------------------------
  // 画面遷移 & URLハッシュルーティング (一覧 / 単問閲覧 / 管理)
  // --------------------------------------------------------
  handleHashChange() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#question/')) {
      const qId = decodeURIComponent(hash.replace('#question/', ''));
      this.openQuestionDetail(qId, false);
    } else if (hash === '#admin') {
      this.setMode('admin', false);
    } else {
      this.setMode('view', false);
    }
  }

  navigateTo(mode, questionId = null) {
    if (mode === 'detail' && questionId) {
      const targetHash = `#question/${encodeURIComponent(questionId)}`;
      if (window.location.hash === targetHash) {
        this.openQuestionDetail(questionId, false);
      } else {
        window.location.hash = targetHash;
      }
    } else if (mode === 'admin') {
      if (window.location.hash === '#admin') {
        this.setMode('admin', false);
      } else {
        window.location.hash = '#admin';
      }
    } else {
      if (window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
      this.setMode('view', false);
    }
  }

  setMode(mode, updateHash = true) {
    if (updateHash) {
      this.navigateTo(mode, this.currentQuestionId);
      return;
    }

    this.currentMode = mode;
    const viewSection = document.getElementById('view-mode');
    const detailSection = document.getElementById('detail-mode');
    const adminSection = document.getElementById('admin-mode');
    const modeIcon = document.getElementById('mode-icon');
    const modeText = document.getElementById('mode-text');

    viewSection?.classList.remove('active');
    detailSection?.classList.remove('active');
    adminSection?.classList.remove('active');

    if (mode === 'admin') {
      adminSection?.classList.add('active');
      modeIcon?.setAttribute('data-lucide', 'arrow-left');
      if (modeText) modeText.textContent = '問題一覧に戻る';
      this.renderAdminTable();
      this.updateAdminCount();
    } else if (mode === 'detail') {
      detailSection?.classList.add('active');
      modeIcon?.setAttribute('data-lucide', 'plus-circle');
      if (modeText) modeText.textContent = '問題を追加・管理';
    } else {
      viewSection?.classList.add('active');
      modeIcon?.setAttribute('data-lucide', 'plus-circle');
      if (modeText) modeText.textContent = '問題を追加・管理';
      this.render();
    }
    this.refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMode() {
    if (this.currentMode === 'admin') {
      this.navigateTo('view');
    } else {
      this.navigateTo('admin');
    }
  }

  setAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabName}`);
    });
    if (tabName === 'manage-list') {
      this.renderAdminTable();
    }
    this.refreshIcons();
  }

  // --------------------------------------------------------
  // 数式・Markdown レンダリング補助
  // --------------------------------------------------------
  renderMarkdownAndKaTeX(text, targetEl) {
    if (!text || !text.trim()) {
      targetEl.innerHTML = '';
      return;
    }

    // marked で Markdown を HTML に変換
    const rawHtml = marked.parse(text, {
      breaks: true,
      gfm: true
    });
    targetEl.innerHTML = rawHtml;

    // KaTeX auto-render で数式を変換
    if (window.renderMathInElement) {
      renderMathInElement(targetEl, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false,
        errorColor: '#ef4444'
      });
    }
  }

  bindEditorPreview(textareaId, previewId) {
    const textarea = document.getElementById(textareaId);
    const preview = document.getElementById(previewId);

    const update = () => {
      this.renderMarkdownAndKaTeX(textarea.value, preview);
    };

    textarea.addEventListener('input', () => {
      clearTimeout(this.debounceTimers[textareaId]);
      this.debounceTimers[textareaId] = setTimeout(update, 150);
    });
  }

  insertMathSnippet(snippet) {
    // 現在アクティブな（あるいは最後の）textareaに挿入
    let target = document.activeElement;
    if (!target || target.tagName !== 'TEXTAREA') {
      target = document.getElementById('form-problem');
    }
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const val = target.value;
    target.value = val.substring(0, start) + snippet + val.substring(end);
    target.selectionStart = target.selectionEnd = start + snippet.length;
    target.focus();
    target.dispatchEvent(new Event('input'));
  }

  // --------------------------------------------------------
  // 閲覧モードの描画 (問題一覧、カテゴリ、統計)
  // --------------------------------------------------------
  render() {
    this.updateCategoryFilter();
    this.renderTagCloud();
    this.renderQuestionList();
    this.updateStats();
  }

  updateCategoryFilter() {
    const select = document.getElementById('filter-category');
    const currentVal = select.value;
    const categories = Array.from(new Set(this.questions.map(q => q.category).filter(Boolean))).sort();

    select.innerHTML = '<option value="all">すべてのカテゴリ</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });

    if (categories.includes(currentVal)) {
      select.value = currentVal;
    }
  }

  renderTagCloud() {
    const cloudEl = document.getElementById('tag-cloud');
    const container = document.getElementById('tag-cloud-container');
    const allTags = new Set();
    this.questions.forEach(q => {
      (q.tags || []).forEach(t => allTags.add(t.trim()));
    });

    const tagsArray = Array.from(allTags).filter(Boolean).sort();
    if (tagsArray.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    cloudEl.innerHTML = '';

    tagsArray.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = `tag-pill ${this.activeTag === tag ? 'active' : ''}`;
      pill.textContent = `#${tag}`;
      pill.addEventListener('click', () => {
        this.activeTag = (this.activeTag === tag) ? null : tag;
        this.renderTagCloud();
        this.renderQuestionList();
      });
      cloudEl.appendChild(pill);
    });
  }

  getFilteredQuestions() {
    const searchVal = document.getElementById('global-search').value.toLowerCase().trim();
    const catVal = document.getElementById('filter-category').value;
    const diffVal = document.getElementById('filter-difficulty').value;
    const statusVal = document.getElementById('filter-status').value;
    const sortVal = document.getElementById('sort-order').value;

    return this.questions.filter(q => {
      // 検索フィルタ
      if (searchVal) {
        const titleMatch = (q.title || '').toLowerCase().includes(searchVal);
        const probMatch = (q.problem || '').toLowerCase().includes(searchVal);
        const solMatch = (q.solution || '').toLowerCase().includes(searchVal);
        const tagMatch = (q.tags || []).some(t => t.toLowerCase().includes(searchVal));
        if (!titleMatch && !probMatch && !solMatch && !tagMatch) return false;
      }

      // カテゴリ
      if (catVal !== 'all' && q.category !== catVal) return false;

      // 難易度
      if (diffVal !== 'all' && String(q.difficulty) !== diffVal) return false;

      // タグ
      if (this.activeTag && !(q.tags || []).includes(this.activeTag)) return false;

      // ステータス
      const currentStatus = this.statusMap[q.id] || 'unlearned';
      if (statusVal === 'unlearned' && currentStatus !== 'unlearned') return false;
      if (statusVal === 'review' && currentStatus !== 'review') return false;
      if (statusVal === 'mastered' && currentStatus !== 'mastered') return false;

      return true;
    }).sort((a, b) => {
      if (sortVal === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortVal === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortVal === 'diff-desc') return (b.difficulty || 1) - (a.difficulty || 1);
      if (sortVal === 'diff-asc') return (a.difficulty || 1) - (b.difficulty || 1);
      return 0;
    });
  }

  renderQuestionList() {
    const container = document.getElementById('questions-list');
    const emptyState = document.getElementById('empty-state');
    const countEl = document.getElementById('result-count');
    const filtered = this.getFilteredQuestions();

    countEl.textContent = `${filtered.length} 問を表示中`;

    if (filtered.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = '';

    filtered.forEach(q => {
      const card = this.createIndexCard(q);
      container.appendChild(card);
    });

    this.refreshIcons();
  }

  // 一覧ページ用のコンパクトカード作成
  createIndexCard(q) {
    const card = document.createElement('div');
    card.className = 'index-card';

    const stars = '★'.repeat(q.difficulty || 1) + '☆'.repeat(5 - (q.difficulty || 1));
    const currentStatus = this.statusMap[q.id] || 'unlearned';
    const statusLabels = {
      mastered: '〇 マスター',
      review: '△ 要復習',
      unlearned: '未着手'
    };

    card.innerHTML = `
      <div>
        <div class="index-card-top">
          <div class="index-card-meta">
            <span class="category-badge">${this.escapeHtml(q.category || '一般')}</span>
            <span class="difficulty-stars" title="難易度: ${q.difficulty}">${stars}</span>
          </div>
          <span class="status-pill ${currentStatus}">${statusLabels[currentStatus]}</span>
        </div>
        <h3 class="index-card-title">${this.escapeHtml(q.title)}</h3>
      </div>

      <div class="index-card-preview math-render-target"></div>

      <div class="index-card-footer">
        <div class="index-card-tags">
          ${(q.tags || []).slice(0, 4).map(t => `<span class="index-tag">#${this.escapeHtml(t)}</span>`).join('')}
        </div>
        <span class="index-open-link">
          問題を解く <i data-lucide="arrow-right"></i>
        </span>
      </div>
    `;

    const previewEl = card.querySelector('.index-card-preview');
    this.renderMarkdownAndKaTeX(q.problem, previewEl);

    card.addEventListener('click', () => {
      this.navigateTo('detail', q.id);
    });

    return card;
  }

  // 単問閲覧ページを開く
  openQuestionDetail(id, updateHash = true) {
    const q = this.questions.find(item => item.id === id);
    if (!q) {
      this.showToast('指定された問題が見つかりませんでした');
      this.navigateTo('view');
      return;
    }

    this.currentQuestionId = id;
    if (updateHash) {
      this.navigateTo('detail', id);
      return;
    }

    this.setMode('detail', false);

    // 単問カードを描画
    const container = document.getElementById('detail-question-container');
    container.innerHTML = '';
    const detailCard = this.createQuestionCard(q, true);
    container.appendChild(detailCard);

    // 現在のフィルターリスト（または全問題リスト）内での前後関係を計算
    let list = this.getFilteredQuestions();
    let idx = list.findIndex(item => item.id === id);
    if (idx === -1) {
      list = this.questions;
      idx = list.findIndex(item => item.id === id);
    }

    // 位置インジケーター
    const posBadge = document.getElementById('detail-position-indicator');
    if (posBadge) {
      posBadge.textContent = `${idx + 1} / ${list.length} 問目`;
    }

    // 前後の問題ボタンの設定
    const prevBtn = document.getElementById('btn-prev-question');
    const nextBtn = document.getElementById('btn-next-question');
    const prevTitle = document.getElementById('prev-q-title');
    const nextTitle = document.getElementById('next-q-title');

    if (prevBtn && prevTitle) {
      if (idx > 0) {
        const prevQ = list[idx - 1];
        prevBtn.disabled = false;
        prevTitle.textContent = prevQ.title;
        prevBtn.onclick = () => this.navigateTo('detail', prevQ.id);
      } else {
        prevBtn.disabled = true;
        prevTitle.textContent = '（最初の問題です）';
        prevBtn.onclick = null;
      }
    }

    if (nextBtn && nextTitle) {
      if (idx >= 0 && idx < list.length - 1) {
        const nextQ = list[idx + 1];
        nextBtn.disabled = false;
        nextTitle.textContent = nextQ.title;
        nextBtn.onclick = () => this.navigateTo('detail', nextQ.id);
      } else {
        nextBtn.disabled = true;
        nextTitle.textContent = '（最後の問題です）';
        nextBtn.onclick = null;
      }
    }

    this.refreshIcons();
  }

  openRandomQuestionPage() {
    if (this.questions.length === 0) {
      this.showToast('問題が登録されていません');
      return;
    }
    let pool = this.questions;
    if (this.questions.length > 1 && this.currentQuestionId) {
      pool = this.questions.filter(q => q.id !== this.currentQuestionId);
    }
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    this.navigateTo('detail', randomQ.id);
  }

  createQuestionCard(q, isModal = false) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-${q.id}`;

    const stars = '★'.repeat(q.difficulty || 1) + '☆'.repeat(5 - (q.difficulty || 1));
    const currentStatus = this.statusMap[q.id] || 'unlearned';

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-badges">
            <span class="category-badge">${this.escapeHtml(q.category || '一般')}</span>
            <span class="difficulty-stars" title="難易度: ${q.difficulty}">${stars}</span>
            ${(q.tags || []).map(t => `<span class="tag-pill">#${this.escapeHtml(t)}</span>`).join('')}
          </div>
          <h2 class="card-title">${this.escapeHtml(q.title)}</h2>
        </div>
        ${!isModal ? `
        <div class="card-meta-actions">
          <button class="btn btn-sm btn-subtle btn-card-edit" title="この問題を編集">
            <i data-lucide="edit-2"></i> 編集
          </button>
        </div>` : ''}
      </div>

      <div class="card-body">
        <div class="problem-box">
          <div class="problem-label"><i data-lucide="help-circle"></i> 問題</div>
          <div class="problem-content math-render-target"></div>
        </div>

        ${q.hint ? `
        <div class="hint-accordion">
          <div class="hint-header">
            <span><i data-lucide="lightbulb"></i> ヒント・着眼点を表示</span>
            <i data-lucide="chevron-down" class="hint-arrow"></i>
          </div>
          <div class="hint-content math-render-target"></div>
        </div>` : ''}
      </div>

      <div class="card-actions-bar">
        <button class="btn-toggle-solution">
          <i data-lucide="eye" class="sol-icon"></i>
          <span class="sol-btn-text">模範解答を見る</span>
        </button>
      </div>

      <div class="solution-container">
        <div class="solution-body">
          <div class="solution-main math-render-target"></div>
          ${q.alternative ? `
          <div class="alternative-box">
            <div class="alternative-content math-render-target"></div>
          </div>` : ''}
        </div>
      </div>

      <div class="card-footer">
        <div class="status-buttons">
          <span class="status-label">理解度:</span>
          <button class="btn-status ${currentStatus === 'mastered' ? 'active' : ''}" data-status="mastered">
            〇 マスター
          </button>
          <button class="btn-status ${currentStatus === 'review' ? 'active' : ''}" data-status="review">
            △ 要復習
          </button>
          <button class="btn-status ${currentStatus === 'unlearned' ? 'active' : ''}" data-status="unlearned">
            未着手
          </button>
        </div>
      </div>
    `;

    // 数式・Markdownを適用
    const probEl = card.querySelector('.problem-content');
    this.renderMarkdownAndKaTeX(q.problem, probEl);

    if (q.hint) {
      const hintEl = card.querySelector('.hint-content');
      this.renderMarkdownAndKaTeX(q.hint, hintEl);

      const hintHeader = card.querySelector('.hint-header');
      const hintAccordion = card.querySelector('.hint-accordion');
      hintHeader.addEventListener('click', () => {
        hintAccordion.classList.toggle('open');
      });
    }

    const solEl = card.querySelector('.solution-main');
    this.renderMarkdownAndKaTeX(q.solution, solEl);

    if (q.alternative) {
      const altEl = card.querySelector('.alternative-content');
      this.renderMarkdownAndKaTeX(q.alternative, altEl);
    }

    // 解答開閉トグル
    const solBtn = card.querySelector('.btn-toggle-solution');
    const solContainer = card.querySelector('.solution-container');
    const solText = card.querySelector('.sol-btn-text');
    solBtn.addEventListener('click', () => {
      const isOpen = solContainer.classList.toggle('open');
      solBtn.classList.toggle('open', isOpen);
      solText.textContent = isOpen ? '解答を隠す' : '模範解答を見る';
      const icon = solBtn.querySelector('.sol-icon');
      if (icon) icon.setAttribute('data-lucide', isOpen ? 'eye-off' : 'eye');
      this.refreshIcons();
    });

    // 理解度ボタントグル
    card.querySelectorAll('.btn-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const status = btn.getAttribute('data-status');
        this.statusMap[q.id] = status;
        this.saveStatus();
        card.querySelectorAll('.btn-status').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.updateStats();
        this.showToast(`「${q.title}」のステータスを更新しました`);
      });
    });

    // 編集ボタン
    const editBtn = card.querySelector('.btn-card-edit');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.editQuestion(q.id);
      });
    }

    return card;
  }

  toggleAllSolutions(open) {
    document.querySelectorAll('.question-card').forEach(card => {
      const solContainer = card.querySelector('.solution-container');
      const solBtn = card.querySelector('.btn-toggle-solution');
      const solText = card.querySelector('.sol-btn-text');
      if (solContainer && solBtn) {
        solContainer.classList.toggle('open', open);
        solBtn.classList.toggle('open', open);
        if (solText) solText.textContent = open ? '解答を隠す' : '模範解答を見る';
        const icon = solBtn.querySelector('.sol-icon');
        if (icon) icon.setAttribute('data-lucide', open ? 'eye-off' : 'eye');
      }
    });
    this.refreshIcons();
  }

  updateStats() {
    const total = this.questions.length;
    let mastered = 0;
    let review = 0;
    let unlearned = 0;

    this.questions.forEach(q => {
      const st = this.statusMap[q.id] || 'unlearned';
      if (st === 'mastered') mastered++;
      else if (st === 'review') review++;
      else unlearned++;
    });

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-mastered').textContent = mastered;
    document.getElementById('stat-review').textContent = review;
    document.getElementById('stat-unlearned').textContent = unlearned;
  }

  // --------------------------------------------------------
  // ランダム出題モーダル
  // --------------------------------------------------------
  showRandomQuestion() {
    if (this.questions.length === 0) {
      this.showToast('問題が登録されていません');
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.questions.length);
    const q = this.questions[randomIndex];

    const modalContent = document.getElementById('random-modal-content');
    modalContent.innerHTML = '';
    const card = this.createQuestionCard(q, true);
    modalContent.appendChild(card);

    document.getElementById('random-modal').classList.add('active');
    this.refreshIcons();
  }

  closeRandomModal() {
    document.getElementById('random-modal').classList.remove('active');
  }

  // --------------------------------------------------------
  // 管理モード: 問題作成 & 編集
  // --------------------------------------------------------
  editQuestion(id) {
    const q = this.questions.find(item => item.id === id);
    if (!q) return;

    this.editingId = id;
    document.getElementById('form-id').value = q.id;
    document.getElementById('form-title').value = q.title || '';
    document.getElementById('form-category').value = q.category || '';
    document.getElementById('form-difficulty').value = q.difficulty || 3;
    document.getElementById('form-tags').value = (q.tags || []).join(', ');
    document.getElementById('form-problem').value = q.problem || '';
    document.getElementById('form-hint').value = q.hint || '';
    document.getElementById('form-solution').value = q.solution || '';
    document.getElementById('form-alternative').value = q.alternative || '';

    document.getElementById('form-tab-title').textContent = '問題を編集';
    document.getElementById('save-btn-text').textContent = '変更を保存';

    // プレビューを即座に更新
    ['problem', 'hint', 'solution', 'alternative'].forEach(field => {
      const textarea = document.getElementById(`form-${field}`);
      const preview = document.getElementById(`preview-${field}`);
      this.renderMarkdownAndKaTeX(textarea.value, preview);
    });

    this.setMode('admin');
    this.setAdminTab('editor');
  }

  resetForm() {
    this.editingId = null;
    document.getElementById('question-form').reset();
    document.getElementById('form-id').value = '';
    document.getElementById('form-difficulty').value = 3;
    document.getElementById('form-tab-title').textContent = '新しい問題を作成';
    document.getElementById('save-btn-text').textContent = '保存して一覧に反映';

    ['problem', 'hint', 'solution', 'alternative'].forEach(field => {
      const preview = document.getElementById(`preview-${field}`);
      preview.innerHTML = '';
    });
  }

  handleFormSubmit() {
    const title = document.getElementById('form-title').value.trim();
    const category = document.getElementById('form-category').value.trim() || '一般';
    const difficulty = parseInt(document.getElementById('form-difficulty').value, 10) || 3;
    const tags = document.getElementById('form-tags').value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const problem = document.getElementById('form-problem').value;
    const hint = document.getElementById('form-hint').value;
    const solution = document.getElementById('form-solution').value;
    const alternative = document.getElementById('form-alternative').value;

    if (!title || !problem || !solution) {
      alert('タイトル、問題文、模範解答は必須項目です。');
      return;
    }

    const now = new Date().toISOString();
    let targetId = this.editingId;

    if (this.editingId) {
      // 既存の更新
      const index = this.questions.findIndex(q => q.id === this.editingId);
      if (index !== -1) {
        this.questions[index] = {
          ...this.questions[index],
          title,
          category,
          difficulty,
          tags,
          problem,
          hint,
          solution,
          alternative,
          updatedAt: now
        };
        this.showToast(`問題「${title}」を更新しました`);
      }
    } else {
      // 新規作成
      targetId = 'q-' + Date.now();
      const newQuestion = {
        id: targetId,
        title,
        category,
        difficulty,
        tags,
        problem,
        hint,
        solution,
        alternative,
        createdAt: now,
        updatedAt: now
      };
      this.questions.unshift(newQuestion);
      this.showToast(`新しい問題「${title}」を登録しました`);
    }

    this.saveQuestions(true);
    this.resetForm();
    this.navigateTo('detail', targetId);
  }

  // --------------------------------------------------------
  // 管理モード: 問題一覧テーブル
  // --------------------------------------------------------
  renderAdminTable() {
    const tbody = document.getElementById('manage-table-body');
    tbody.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const tr = document.createElement('tr');
      const stars = '★'.repeat(q.difficulty || 1);
      const dateStr = q.updatedAt ? new Date(q.updatedAt).toLocaleDateString('ja-JP') : '-';

      tr.innerHTML = `
        <td><strong>${this.escapeHtml(q.title)}</strong></td>
        <td><span class="category-badge">${this.escapeHtml(q.category || '-')}</span></td>
        <td style="color:#f59e0b">${stars}</td>
        <td style="color:var(--text-muted); font-size:0.8rem;">${dateStr}</td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-sm btn-primary btn-admin-view" data-id="${q.id}">閲覧</button>
            <button class="btn btn-sm btn-secondary btn-admin-edit" data-id="${q.id}">編集</button>
            <button class="btn btn-sm btn-subtle btn-admin-clone" data-id="${q.id}">複製</button>
            <button class="btn btn-sm btn-danger btn-admin-del" data-id="${q.id}">削除</button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-admin-view').addEventListener('click', () => this.navigateTo('detail', q.id));
      tr.querySelector('.btn-admin-edit').addEventListener('click', () => this.editQuestion(q.id));
      tr.querySelector('.btn-admin-clone').addEventListener('click', () => this.cloneQuestion(q.id));
      tr.querySelector('.btn-admin-del').addEventListener('click', () => this.deleteQuestion(q.id));

      tbody.appendChild(tr);
    });
  }

  updateAdminCount() {
    document.getElementById('admin-list-count').textContent = this.questions.length;
  }

  cloneQuestion(id) {
    const target = this.questions.find(q => q.id === id);
    if (!target) return;

    const cloned = {
      ...target,
      id: 'q-' + Date.now(),
      title: `${target.title} (コピー)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.questions.unshift(cloned);
    this.saveQuestions(true);
    this.renderAdminTable();
    this.updateAdminCount();
    this.showToast('問題を複製しました');
  }

  deleteQuestion(id) {
    const target = this.questions.find(q => q.id === id);
    if (!target) return;

    if (!confirm(`問題「${target.title}」を本当に削除しますか？`)) {
      return;
    }

    this.questions = this.questions.filter(q => q.id !== id);
    delete this.statusMap[id];
    this.saveQuestions(true);
    this.saveStatus();
    this.renderAdminTable();
    this.updateAdminCount();
    this.showToast('問題を削除しました');
  }

  // --------------------------------------------------------
  // GitHub API 直接連携 (自動クラウド同期)
  // --------------------------------------------------------
  loadGitHubConfig() {
    try {
      const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
      this.githubConfig = raw ? JSON.parse(raw) : {
        repo: 'acky-volley/math-archive',
        branch: 'main',
        path: 'questions.json',
        token: '',
        autoSync: true
      };
    } catch (e) {
      this.githubConfig = {
        repo: 'acky-volley/math-archive',
        branch: 'main',
        path: 'questions.json',
        token: '',
        autoSync: true
      };
    }

    const repoEl = document.getElementById('gh-repo');
    const branchEl = document.getElementById('gh-branch');
    const pathEl = document.getElementById('gh-path');
    const tokenEl = document.getElementById('gh-token');
    const autoSyncEl = document.getElementById('gh-auto-sync');

    if (repoEl) repoEl.value = this.githubConfig.repo || '';
    if (branchEl) branchEl.value = this.githubConfig.branch || 'main';
    if (pathEl) pathEl.value = this.githubConfig.path || 'questions.json';
    if (tokenEl) tokenEl.value = this.githubConfig.token || '';
    if (autoSyncEl) autoSyncEl.checked = this.githubConfig.autoSync !== false;

    this.updateGitHubBadge();
  }

  saveGitHubConfig() {
    const repo = document.getElementById('gh-repo')?.value.trim() || '';
    const branch = document.getElementById('gh-branch')?.value.trim() || 'main';
    const path = document.getElementById('gh-path')?.value.trim().replace(/^\/+/, '') || 'questions.json';
    const token = document.getElementById('gh-token')?.value.trim() || '';
    const autoSync = document.getElementById('gh-auto-sync')?.checked !== false;

    this.githubConfig = { repo, branch, path, token, autoSync };
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(this.githubConfig));
    this.updateGitHubBadge();
    this.showToast('GitHub連携設定を保存しました');
  }

  updateGitHubBadge() {
    const badge = document.getElementById('github-sync-status');
    if (!badge) return;
    if (this.githubConfig?.repo && this.githubConfig?.token) {
      badge.textContent = `連携済み (${this.githubConfig.repo})`;
      badge.classList.add('connected');
    } else {
      badge.textContent = '未設定';
      badge.classList.remove('connected');
    }
  }

  async pushToGitHub(silent = false) {
    this.saveGitHubConfig();
    const { repo, branch, path, token } = this.githubConfig;

    if (!repo || !token) {
      if (!silent) {
        alert('GitHubリポジトリ名（例: acky-volley/math-archive）と Personal Access Token を入力してください。');
      }
      return;
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    try {
      if (!silent) this.showToast('GitHubへ同期中...');

      // 1. 既存ファイルの SHA を取得
      let sha = undefined;
      const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2. UTF-8 文字列を Base64 に変換して PUT
      const jsonStr = JSON.stringify(this.questions, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

      const body = {
        message: `Update ${path} (${this.questions.length} questions) via MathArchive`,
        content: base64Content,
        branch
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!putRes.ok) {
        const errData = await putRes.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${putRes.status}`);
      }

      this.showToast('☁️ GitHubリポジトリへ同期（保存）しました！');
    } catch (err) {
      console.error('GitHub Sync Error:', err);
      if (!silent) {
        alert(`GitHubへの同期に失敗しました:\n${err.message}\n\nリポジトリ名・ブランチ名・トークンの権限(repo / contents:write)をご確認ください。`);
      } else {
        this.showToast(`⚠️ GitHub自動同期失敗: ${err.message}`);
      }
    }
  }

  async pullFromGitHub() {
    this.saveGitHubConfig();
    const { repo, branch, path, token } = this.githubConfig;

    if (!repo) {
      alert('GitHubリポジトリ名を入力してください。');
      return;
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
    const headers = {
      'Accept': 'application/vnd.github+json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      this.showToast('GitHubから最新データを取得中...');
      const res = await fetch(apiUrl, { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} (ファイルが見つからないか権限がありません)`);
      }

      const data = await res.json();
      const decodedStr = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
      const remoteQuestions = JSON.parse(decodedStr);

      if (Array.isArray(remoteQuestions)) {
        this.questions = remoteQuestions;
        this.saveQuestions(false);
        this.renderAdminTable();
        this.updateAdminCount();
        this.showToast(`☁️ GitHubから ${remoteQuestions.length} 問を読み込みました！`);
      }
    } catch (err) {
      alert(`GitHubからの取得に失敗しました:\n${err.message}`);
    }
  }

  // --------------------------------------------------------
  // データ管理・エクスポート / インポート
  // --------------------------------------------------------
  exportGitHubJson() {
    // GitHub Pages 公開用に questions.json としてダウンロード
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "questions.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('questions.json をダウンロードしました！');
  }

  exportBackup() {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      questions: this.questions,
      statusMap: this.statusMap
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `math-archive-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('バックアップファイルを保存しました');
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (Array.isArray(json)) {
          // 単純な questions 配列形式
          this.questions = json;
        } else if (json.questions && Array.isArray(json.questions)) {
          // バックアップ形式
          this.questions = json.questions;
          if (json.statusMap) {
            this.statusMap = json.statusMap;
            this.saveStatus();
          }
        } else {
          alert('不正なJSON形式です。');
          return;
        }

        this.saveQuestions();
        this.renderAdminTable();
        this.updateAdminCount();
        this.showToast('バックアップから正常に復元しました！');
      } catch (err) {
        alert('ファイルの読み込みに失敗しました: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  reloadSamples() {
    if (!confirm('現在のデータを破棄し、初期のサンプル問題（3問）を再読み込みしますか？')) {
      return;
    }
    this.questions = [...FALLBACK_QUESTIONS];
    this.statusMap = {};
    this.saveQuestions();
    this.saveStatus();
    this.renderAdminTable();
    this.updateAdminCount();
    this.showToast('初期サンプルを読み込みました');
  }

  resetAllData() {
    if (!confirm('本当にすべての問題データを削除しますか？この操作は元に戻せません。')) {
      return;
    }
    this.questions = [];
    this.statusMap = {};
    this.saveQuestions();
    this.saveStatus();
    this.renderAdminTable();
    this.updateAdminCount();
    this.showToast('すべてのデータを初期化しました');
  }

  // --------------------------------------------------------
  // ユーティリティ
  // --------------------------------------------------------
  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// アプリケーション起動
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MathArchiveApp();
});
