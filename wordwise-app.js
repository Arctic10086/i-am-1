(function () {
  const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

  const STORAGE_KEY = 'wordwise_v1';
  const APP_NAME = 'I am 1';

  const QUOTES = [
    '日积跬步，终至千里。',
    '记忆是重复与意义的合奏。',
    '专注一词，胜过泛览十页。',
    '今天的努力，是明天流畅阅读的伏笔。'
  ];

  const INTERVALS = [1, 3, 7, 30];

  const SAMPLE_LEXICON = [
    { word: 'interaction', phonetic: 'ˌɪntərˈækʃn', translation: 'n. 互动，交流，沟通；相互影响\n[网络] 相互作用', definition: 'communication between people, groups, or countries', exchange: 's:interactions', pos: 'n' },
    { word: 'participate', phonetic: "pɑːrˈtɪsɪpeɪt", translation: 'vi. 参与，参加\nvt. 分享；分担', definition: 'to take part in an activity or event', exchange: 'd:participated/p:participated/i:participating/3:participates', pos: 'vi' },
    { word: 'intersection', phonetic: 'ˌɪntərˈsekʃn', translation: 'n. 交点；十字路口；交叉', definition: 'a point where two lines meet or cross', exchange: 's:intersections', pos: 'n' },
    { word: 'instruction', phonetic: 'ɪnˈstrʌkʃn', translation: 'n. 指示；用法说明；教学', definition: 'detailed information on how to do something', exchange: 's:instructions', pos: 'n' },
    { word: 'interruption', phonetic: 'ˌɪntəˈrʌpʃn', translation: 'n. 中断；打扰', definition: 'something that stops something else', exchange: 's:interruptions', pos: 'n' },
    { word: 'strategy', phonetic: 'ˈstrætədʒi', translation: 'n. 策略，战略', definition: 'a plan for achieving success', exchange: 's:strategies', pos: 'n' },
    { word: 'obstacle', phonetic: 'ˈɑːbstəkl', translation: 'n. 障碍', definition: 'something that blocks progress', exchange: 's:obstacles', pos: 'n' },
    { word: 'psychological', phonetic: 'ˌsaɪkəˈlɑːdʒɪkl', translation: 'adj. 心理的；心理学的', definition: 'relating to the mind', exchange: '', pos: 'adj' },
    { word: 'voluntary', phonetic: 'ˈvɑːlənteri', translation: 'adj. 自愿的', definition: 'done by choice', exchange: '', pos: 'adj' },
    { word: 'contemporary', phonetic: 'kənˈtempəreri', translation: 'adj. 当代的 n. 同代人', definition: 'belonging to the present time', exchange: 's:contemporaries', pos: 'adj' },
    { word: 'negotiate', phonetic: 'nɪˈɡoʊʃieɪt', translation: 'v. 谈判，协商', definition: 'to discuss to reach agreement', exchange: 'd:negotiated/i:negotiating/3:negotiates', pos: 'v' },
    { word: 'primary', phonetic: 'ˈpraɪmeri', translation: 'adj. 主要的；初级的', definition: 'most important', exchange: '', pos: 'adj' },
    { word: 'crucial', phonetic: 'ˈkruːʃl', translation: 'adj. 至关重要的', definition: 'extremely important', exchange: '', pos: 'adj' },
    { word: 'theory', phonetic: 'ˈθɪəri', translation: 'n. 理论', definition: 'an idea to explain facts', exchange: 's:theories', pos: 'n' },
    { word: 'signal', phonetic: 'ˈsɪɡnəl', translation: 'n. 信号 v. 发信号', definition: 'a sign or message', exchange: 'd:signalled/i:signalling/3:signals', pos: 'n' },
    { word: 'vehicle', phonetic: 'ˈviːəkl', translation: 'n. 车辆；媒介', definition: 'a machine for travel', exchange: 's:vehicles', pos: 'n' },
    { word: 'tolerance', phonetic: 'ˈtɑːlərəns', translation: 'n. 宽容；容忍', definition: 'willingness to accept', exchange: '', pos: 'n' },
    { word: 'individual', phonetic: 'ˌɪndɪˈvɪdʒuəl', translation: 'n. 个人 adj. 单独的', definition: 'a single person', exchange: 's:individuals', pos: 'n' },
    { word: 'access', phonetic: 'ˈækses', translation: 'n. 通道；使用权 v. 访问', definition: 'the right to use', exchange: '', pos: 'n' },
    { word: 'alternative', phonetic: 'ɔːlˈtɜːrnətɪv', translation: 'n. 替代品 adj. 替代的', definition: 'another possibility', exchange: 's:alternatives', pos: 'n' },
    { word: 'generous', phonetic: 'ˈdʒenərəs', translation: 'adj. 慷慨的', definition: 'giving freely', exchange: '', pos: 'adj' },
    { word: 'depressed', phonetic: 'dɪˈprest', translation: 'adj. 沮丧的；萧条的', definition: 'very unhappy', exchange: '', pos: 'adj' },
    { word: 'automatic', phonetic: 'ˌɔːtəˈmætɪk', translation: 'adj. 自动的', definition: 'working by itself', exchange: '', pos: 'adj' },
    { word: 'institution', phonetic: 'ˌɪnstɪˈtuːʃn', translation: 'n. 机构；制度', definition: 'a large organization', exchange: 's:institutions', pos: 'n' },
    { word: 'persistent', phonetic: 'pərˈsɪstənt', translation: 'adj. 持续的；坚持不懈的', definition: 'continuing firmly', exchange: '', pos: 'adj' },
    { word: 'logic', phonetic: 'ˈlɑːdʒɪk', translation: 'n. 逻辑', definition: 'reasoning', exchange: '', pos: 'n' },
    { word: 'download', phonetic: 'ˌdaʊnˈloʊd', translation: 'v. 下载 n. 下载', definition: 'copy data from internet', exchange: 'd:downloaded/i:downloading/3:downloads', pos: 'v' },
    { word: 'smooth', phonetic: 'smuːð', translation: 'adj. 光滑的；顺利的', definition: 'flat and even', exchange: '', pos: 'adj' },
    { word: 'opposite', phonetic: 'ˈɑːpəzɪt', translation: 'adj. 相反的 n. 对立面', definition: 'completely different', exchange: 's:opposites', pos: 'adj' },
    { word: 'paradox', phonetic: 'ˈpærədɑːks', translation: 'n. 悖论', definition: 'a situation with contradictory parts', exchange: 's:paradoxes', pos: 'n' },
    { word: 'flaw', phonetic: 'flɔː', translation: 'n. 缺点', definition: 'a mistake or weakness', exchange: 's:flaws', pos: 'n' }
  ];

  const DECKS = {
    cet4: { name: '四级 · 乱序', desc: '加载中…', words: null },
    cet6: { name: '六级 · 乱序', desc: '加载中…', words: null },
    shuffle: { name: '四六级 · 综合乱序', desc: '加载中…', words: null }
  };

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
      return defaultState();
    }
  }

  function defaultState() {
    return {
      settings: { masteryMode: 'full', accent: 'US', autoSpeak: true, dailyGoal: 20, weekGoal: 140 },
      signIn: { dates: {}, streak: 0, last: '' },
      stats: { byDay: {}, minutesByDay: {} },
      progress: {},
      wrongBook: {},
      notes: {},
      starred: {},
      tempWords: [],
      activeDeck: 'cet4',
      notebook: [],
      lexiconExtra: [],
      morningReviewPromptDate: ''
    };
  }

  function saveState(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  function normWord(w) {
    return String(w || '').trim().toLowerCase();
  }

  function stemKey(w) {
    const x = normWord(w).replace(/(ing|ed|es|s|tion|sion|ment|ness|less|ful|ous|ive|ize|ise)$/i, '');
    return x.length >= 3 ? x : normWord(w);
  }

  function sameRootish(a, b) {
    const A = normWord(a), B = normWord(b);
    if (A === B) return true;
    let p = 0;
    while (p < A.length && p < B.length && A[p] === B[p]) p++;
    if (p >= 4) return true;
    if (A.includes(B) || B.includes(A)) if (Math.min(A.length, B.length) >= 4) return true;
    if (stemKey(A) === stemKey(B) && stemKey(A).length >= 4) return true;
    return false;
  }

  function parseCSV(text) {
    const rows = [];
    let i = 0, field = '', row = [], inQ = false;
    const s = text.replace(/^\uFEFF/, '');
    while (i < s.length) {
      const c = s[i];
      if (inQ) {
        if (c === '"') {
          if (s[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQ = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\r') { i++; continue; }
      if (c === '\n') {
        row.push(field); field = '';
        if (row.some((x) => x !== '')) rows.push(row);
        row = []; i++; continue;
      }
      field += c; i++;
    }
    if (field.length || row.length) { row.push(field); if (row.some((x) => x !== '')) rows.push(row); }
    return rows;
  }

  function rowsToEntries(rows) {
    if (!rows.length) return [];
    const h = rows[0].map((x) => normWord(x).replace(/[^a-z]/g, ''));
    const idx = (name) => h.indexOf(name);
    const iw = idx('word');
    if (iw < 0) return [];
    const ip = idx('phonetic');
    const idf = idx('definition');
    const it = idx('translation');
    const ix = idx('exchange');
    const ipos = idx('pos');
    const isy = idx('synonyms');
    const ira = idx('rootaffix');
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row[iw]) continue;
      const word = row[iw].replace(/^'/, '').trim();
      if (!word) continue;
      out.push({
        word,
        phonetic: ip >= 0 ? row[ip] : '',
        definition: idf >= 0 ? row[idf] : '',
        translation: it >= 0 ? row[it] : '',
        exchange: ix >= 0 ? row[ix] : '',
        pos: ipos >= 0 ? row[ipos] : '',
        synonyms: isy >= 0 ? row[isy] : '',
        rootAffix: ira >= 0 ? row[ira] : ''
      });
    }
    return out;
  }

  function firstSense(translation) {
    if (!translation) return { pos: '', text: '' };
    const lines = translation.split(/\n/).map((l) => l.trim()).filter(Boolean);
    const line = lines[0] || '';
    const m = line.match(/^([a-z]+\.)\s*(.+)$/i);
    if (m) return { pos: m[1], text: m[2] };
    return { pos: '释义', text: line };
  }

  function allSenses(translation) {
    if (!translation) return [];
    return translation.split(/\n/).map((l) => l.trim()).filter(Boolean).map((line) => {
      const m = line.match(/^([a-z]+\.)\s*(.+)$/i);
      if (m) return { pos: m[1], text: m[2] };
      return { pos: '', text: line };
    });
  }

  function fakeExample(word) {
    const w = word;
    return {
      en: `The teacher is happy when her students **${w}** in class discussions.`,
      zh: `当学生们能在课堂讨论中做到与「${w}」相关的行为时，老师会很高兴。（示意例句）`
    };
  }

  function buildLexiconMap(entries) {
    const m = new Map();
    entries.forEach((e) => m.set(normWord(e.word), e));
    return m;
  }

  /** @param {{ words?: [string, string][] }} pack */
  function entriesFromCetPack(pack) {
    const pairs = pack.words || [];
    return pairs.map(([word, translation]) => ({
      word,
      translation,
      phonetic: '',
      definition: '',
      exchange: '',
      pos: '',
      synonyms: '',
      rootAffix: ''
    }));
  }

  function pickDistractors(target, pool, lexicon, n) {
    const t = target.word;
    const senses = allSenses(target.translation);
    const used = new Set([normWord(t)]);
    const out = [];
    const candidates = pool.filter((w) => w !== t && !sameRootish(w, t));
    for (let k = 0; k < candidates.length && out.length < n; k++) {
      const w = candidates[k];
      const nw = normWord(w);
      if (used.has(nw)) continue;
      const ent = lexicon.get(nw);
      if (!ent) continue;
      const bad = senses.some((s) => ent.translation && ent.translation.includes(s.text.slice(0, 6)));
      if (bad) continue;
      used.add(nw);
      out.push(ent);
    }
    let i = 0;
    while (out.length < n && i < pool.length) {
      const w = pool[i++];
      const nw = normWord(w);
      if (used.has(nw)) continue;
      const ent = lexicon.get(nw);
      if (!ent) continue;
      if (sameRootish(w, t)) continue;
      used.add(nw);
      out.push(ent);
      if (out.length >= n) break;
    }
    return out;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fetchJSON(url, timeoutMs) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs || 8000);
    return fetch(url, { signal: ctrl.signal })
      .then((r) => r.json())
      .finally(() => clearTimeout(t));
  }

  function parseHzImage(j) {
    if (!j || typeof j !== 'object') return '';
    const cand = j.img || j.pic || j.url || j.image || j.link;
    if (typeof cand === 'string' && /^https?:\/\//i.test(cand)) return cand;
    if (j.data) {
      const d = j.data;
      if (typeof d === 'string' && /^https?:\/\//i.test(d)) return d;
      if (Array.isArray(d) && d[0]) {
        const x = d[0];
        if (typeof x === 'string') return x;
        if (x && typeof x === 'object') return x.url || x.img || x.pic || '';
      }
      if (d && typeof d === 'object') return d.url || d.img || d.pic || '';
    }
    return '';
  }

  createApp({
    setup() {
      const view = ref('home');
      const toast = ref('');
      const state = ref(loadState());
      const lexicon = ref(buildLexiconMap(SAMPLE_LEXICON));
      const deckKeys = Object.keys(DECKS);
      const decks = DECKS;
      const lexiconBundlesLoading = ref(true);

      const sessionQueue = ref([]);
      const sessionIndex = ref(0);
      const sessionMode = ref('deck');
      const metaChoice = ref(null);
      const uncertain = ref(false);
      const quiz = ref(null);
      const hintLevel = ref(0);
      const hintImage = ref('');
      const spellInput = ref('');
      const spellHinted = ref(false);
      const lastResult = ref(null);
      const feedbackImage = ref('');
      const detailEntry = ref(null);
      const detailTab = ref('def');
      const detailHighlightIdx = ref(0);
      const fold = ref({ colloc: true, root: true, en: false });
      const noteDraft = ref('');
      const searchQ = ref('');
      const searchResult = ref(null);
      const searchError = ref('');
      const searchLoading = ref(false);
      const apiLoading = ref(false);
      const modalExit = ref(false);
      const modalExitText = ref('');
      const metaTimer = ref(null);
      const studyStart = ref(null);
      const detailReturnView = ref(null);
      const detailScreenImage = ref('');
      const detailFromStrikes = ref(false);
      const sessionReviewAlternate = ref(false);
      const pickPlanRows = ref([]);
      const pickPlanSearchQ = ref('');
      const pickPlanSearchLoading = ref(false);
      const calendarOffset = ref(0);
      const calTouch = ref({ x0: 0, t0: 0 });

      const settings = computed({
        get: () => state.value.settings,
        set: (v) => { state.value.settings = v; persist(); }
      });

      function persist() { saveState(state.value); }

      function showToast(msg, t) {
        toast.value = msg;
        setTimeout(() => { toast.value = ''; }, t || 2200);
      }

      const lexiconSize = computed(() => lexicon.value.size);

      const signedToday = computed(() => {
        const d = todayISO();
        return !!state.value.signIn.dates[d];
      });

      const streak = computed(() => state.value.signIn.streak || 0);

      const signQuote = computed(() => {
        const d = todayISO();
        const n = (d.split('-').join('') | 0) % QUOTES.length;
        return signedToday.value ? QUOTES[n] : '签到领取今日励志句';
      });

      const calDays = computed(() => {
        const out = [];
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const center = new Date(todayStart);
        center.setDate(center.getDate() - calendarOffset.value);
        for (let i = -3; i <= 3; i++) {
          const d = new Date(center);
          d.setDate(center.getDate() + i);
          const key = d.toISOString().slice(0, 10);
          const isToday = d.getTime() === todayStart.getTime();
          out.push({
            key,
            label: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            signed: !!state.value.signIn.dates[key],
            today: isToday
          });
        }
        return out;
      });

      const todayLearned = computed(() => {
        const d = todayISO();
        const x = state.value.stats.byDay[d] || { learn: 0, review: 0 };
        return (x.learn || 0) + (x.review || 0);
      });

      const weekRemain = computed(() => {
        const now = new Date();
        const dow = now.getDay() || 7;
        const start = new Date(now);
        start.setDate(start.getDate() - (dow - 1));
        let sum = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const key = d.toISOString().slice(0, 10);
          const x = state.value.stats.byDay[key];
          sum += (x && x.learn) || 0;
          sum += (x && x.review) || 0;
        }
        return Math.max(0, state.value.settings.weekGoal - sum);
      });

      const weekProgressPct = computed(() => {
        const g = state.value.settings.weekGoal || 140;
        return Math.min(100, Math.round(((g - weekRemain.value) / g) * 100));
      });

      const todayStats = computed(() => {
        const d = todayISO();
        const b = state.value.stats.byDay[d] || { learn: 0, review: 0 };
        const minutes = state.value.stats.minutesByDay[d] || 0;
        return { learn: b.learn || 0, review: b.review || 0, minutes };
      });

      const weekBars = computed(() => {
        const now = new Date();
        const arr = [];
        for (let i = -6; i <= 0; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() + i);
          const key = d.toISOString().slice(0, 10);
          const x = state.value.stats.byDay[key] || { learn: 0, review: 0 };
          arr.push({
            label: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            learn: x.learn || 0,
            review: x.review || 0,
            today: i === 0
          });
        }
        return arr;
      });

      const maxBar = computed(() => {
        let m = 1;
        weekBars.value.forEach((b) => { m = Math.max(m, b.learn + b.review); });
        return m;
      });

      const wrongList = computed(() => {
        const wb = state.value.wrongBook || {};
        return Object.keys(wb).map((k) => ({
          word: wb[k].display || k,
          translation: (lexicon.value.get(normWord(k)) || {}).translation || wb[k].translation || '',
          wrongCount: wb[k].wrongCount || 0,
          correctStreak: wb[k].correctStreak || 0
        })).sort((a, b) => b.wrongCount - a.wrongCount);
      });

      const currentEntry = computed(() => sessionQueue.value[sessionIndex.value] || null);

      const quizModeLabel = computed(() => {
        if (!quiz.value) return '';
        const m = { word2zh: '看词选义', zh2word: '看义选词', listen2zh: '听音选义', spell: '听音拼写', multisense: '多义全选' };
        return m[quiz.value.type] || '';
      });

      const exampleSentence = computed(() => fakeExample(currentEntry.value && currentEntry.value.word).en.replace(/\*\*(.+?)\*\*/g, '$1'));

      const exampleTranslation = computed(() => fakeExample(currentEntry.value && currentEntry.value.word).zh);

      const highlightExample = computed(() => {
        const w = (currentEntry.value && currentEntry.value.word) || '';
        const ex = fakeExample(w).en;
        return ex.replace(/\*\*(.+?)\*\*/g, '<em>$1</em>');
      });

      const spellPlaceholder = computed(() => (spellHinted.value && currentEntry.value ? currentEntry.value.word[0] + '______' : '输入完整单词'));

      const detailDefLines = computed(() => {
        if (!detailEntry.value) return [];
        return (detailEntry.value.translation || '').split('\n').map((l) => l.trim()).filter(Boolean);
      });

      const detailCollocations = computed(() => {
        const w = detailEntry.value && detailEntry.value.word;
        if (!w) return [];
        return [
          { en: `${w} in context`, zh: `在语境中使用 ${w}` },
          { en: `practice ${w}`, zh: `练习 ${w}` }
        ];
      });

      const relatedWords = computed(() => {
        if (!detailEntry.value) return [];
        const t = stemKey(detailEntry.value.word);
        const out = [];
        lexicon.value.forEach((e) => {
          if (out.length >= 16) return;
          if (e.word === detailEntry.value.word) return;
          if (stemKey(e.word) === t && t.length >= 4) out.push(e.word);
        });
        return out;
      });

      const detailSynonymsLine = computed(() => {
        if (!detailEntry.value) return '';
        const s = detailEntry.value.synonyms;
        return (s && String(s).trim()) || '（导入扩展词典后显示同义词）';
      });

      const detailRootAffixLine = computed(() => {
        if (!detailEntry.value) return '';
        const s = detailEntry.value.rootAffix;
        return (s && String(s).trim()) || '（导入扩展词典后显示词根、词缀分析）';
      });

      function deckWordCount(dk) {
        const d = decks[dk];
        if (d.words) return d.words.length;
        return lexicon.value.size;
      }

      function getProgress(w) {
        const k = normWord(w);
        if (!state.value.progress[k]) {
          state.value.progress[k] = {
            nextDue: todayISO(),
            intervalIdx: 0,
            lastResult: '',
            knowPassDays: [],
            mastered: false,
            familiar: false,
            lastSpellWrongDay: '',
            uncertainPenalty: false,
            studyByDay: {},
            wrongByDay: {},
            consecutiveWrong: 0
          };
        }
        const pr = state.value.progress[k];
        if (!pr.studyByDay) pr.studyByDay = {};
        if (!pr.wrongByDay) pr.wrongByDay = {};
        if (pr.consecutiveWrong == null) pr.consecutiveWrong = 0;
        return pr;
      }

      function bumpStats(kind) {
        const d = todayISO();
        if (!state.value.stats.byDay[d]) state.value.stats.byDay[d] = { learn: 0, review: 0 };
        if (kind === 'learn') state.value.stats.byDay[d].learn++;
        if (kind === 'review') state.value.stats.byDay[d].review++;
        persist();
      }

      function addMinutes(m) {
        const d = todayISO();
        state.value.stats.minutesByDay[d] = (state.value.stats.minutesByDay[d] || 0) + m;
        persist();
      }

      function doSignIn() {
        const d = todayISO();
        if (state.value.signIn.dates[d]) {
          showToast('今日已签到');
          return;
        }
        state.value.signIn.dates[d] = true;
        const last = state.value.signIn.last;
        if (last) {
          const a = new Date(last + 'T12:00:00');
          const b = new Date(d + 'T12:00:00');
          const diff = (b - a) / 86400000;
          if (diff === 1) state.value.signIn.streak = (state.value.signIn.streak || 0) + 1;
          else state.value.signIn.streak = 1;
        } else state.value.signIn.streak = 1;
        state.value.signIn.last = d;
        persist();
        showToast(QUOTES[(d.split('-').join('') | 0) % QUOTES.length]);
      }

      function selectDeck(dk) {
        if (lexiconBundlesLoading.value) {
          showToast('词库正在加载，请稍候');
          return;
        }
        state.value.activeDeck = dk;
        persist();
        buildPickPlanRows();
        pickPlanSearchQ.value = '';
        view.value = 'pickPlan';
      }

      function buildPickPlanRows() {
        const goal = state.value.settings.dailyGoal || 20;
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yKey = y.toISOString().slice(0, 10);
        const dk = state.value.activeDeck || 'cet4';
        const d = decks[dk];
        let deckPool = d.words ? shuffle(d.words.slice()) : shuffle(Array.from(lexicon.value.keys()));
        const seen = new Set();
        const rows = [];
        function pushRow(ent, tag) {
          if (!ent || !ent.word) return;
          const k = normWord(ent.word);
          if (seen.has(k)) return;
          seen.add(k);
          rows.push({ entry: ent, tag, checked: true });
        }
        const keys = Array.from(lexicon.value.keys());
        keys.forEach((k) => {
          const pr = getProgress(k);
          const s = pr.studyByDay[yKey] || 0;
          const w = pr.wrongByDay[yKey] || 0;
          if (s >= 2 && w >= 1) pushRow(lexicon.value.get(k), '昨日多轮/易错');
          else if (s >= 3) pushRow(lexicon.value.get(k), '昨日高强度');
        });
        (state.value.tempWords || []).forEach((tw) => {
          const ent = lexicon.value.get(normWord(tw));
          if (ent) pushRow(ent, '近期搜索');
        });
        const targetPool = Math.min(deckPool.length, Math.max(goal * 2, goal + 15));
        for (let i = 0; i < deckPool.length && rows.length < targetPool; i++) {
          const ent = lexicon.value.get(normWord(deckPool[i]));
          pushRow(ent, '词库随机');
        }
        if (rows.length < goal) {
          for (let i = 0; i < keys.length && rows.length < goal; i++) {
            pushRow(lexicon.value.get(keys[i]), '词库补充');
          }
        }
        pickPlanRows.value = rows;
      }

      function togglePickRow(row) {
        row.checked = !row.checked;
      }

      function togglePickAll(on) {
        pickPlanRows.value.forEach((r) => { r.checked = on; });
      }

      function startPickedPlan() {
        const picked = pickPlanRows.value.filter((r) => r.checked).map((r) => r.entry).filter(Boolean);
        if (!picked.length) { showToast('请至少勾选一个单词'); return; }
        sessionMode.value = 'deck';
        sessionReviewAlternate.value = false;
        metaChoice.value = null;
        uncertain.value = false;
        sessionQueue.value = picked;
        sessionIndex.value = 0;
        studyStart.value = Date.now();
        view.value = 'learn';
        resetHints();
        scheduleMetaHint();
        maybeAutoSpeak();
      }

      function pickPlanSearchOnline() {
        const q = normWord(pickPlanSearchQ.value);
        if (!q) { showToast('请输入要搜索的英文'); return; }
        const local = lexicon.value.get(q);
        if (local) {
          const seen = new Set(pickPlanRows.value.map((r) => normWord(r.entry.word)));
          if (!seen.has(q)) pickPlanRows.value = [{ entry: local, tag: '在线/搜索', checked: true }].concat(pickPlanRows.value);
          addTempSearch(q);
          showToast('已加入待选表');
          return;
        }
        pickPlanSearchLoading.value = true;
        const url = `http://124.222.204.22/api/zici/fanyiapihz.php?id=88888888&key=88888888&word=${encodeURIComponent(q)}`;
        fetchJSON(url, 8000)
          .then((j) => {
            const zh = (j && (j.translation || j.data || j.result || j.msg)) || '';
            if (!zh) { showToast('未找到释义'); return; }
            const ent = {
              word: q,
              phonetic: '',
              translation: String(zh),
              definition: '',
              exchange: '',
              pos: '',
              synonyms: '',
              rootAffix: ''
            };
            const m = new Map(lexicon.value);
            m.set(q, ent);
            lexicon.value = m;
            if (!state.value.lexiconExtra.find((x) => normWord(x.word) === q)) state.value.lexiconExtra.push(ent);
            addTempSearch(q);
            const seen = new Set(pickPlanRows.value.map((r) => normWord(r.entry.word)));
            if (!seen.has(q)) pickPlanRows.value = [{ entry: ent, tag: '在线添加', checked: true }].concat(pickPlanRows.value);
            persist();
            showToast('已在线添加并加入待选表');
          })
          .catch(() => { showToast('网络超时或接口不可用'); })
          .finally(() => { pickPlanSearchLoading.value = false; });
      }

      function calTouchStart(ev) {
        const t = (ev.touches && ev.touches[0]) || ev;
        calTouch.value = { x0: t.clientX, t0: Date.now() };
      }

      function calTouchEnd(ev) {
        const t = (ev.changedTouches && ev.changedTouches[0]) || ev;
        const dx = t.clientX - calTouch.value.x0;
        const dt = Date.now() - calTouch.value.t0;
        if (dt > 600 || Math.abs(dx) < 40) return;
        if (dx < 0) calendarOffset.value += 7;
        else calendarOffset.value = Math.max(0, calendarOffset.value - 7);
      }

      function buildPoolForDeck() {
        const dk = state.value.activeDeck || 'cet4';
        const d = decks[dk];
        let words = d.words ? d.words.slice() : Array.from(lexicon.value.keys());
        if (dk === 'shuffle') words = shuffle(words);
        return words.map((w) => lexicon.value.get(normWord(w))).filter(Boolean);
      }

      function buildDailyQueue() {
        const goal = state.value.settings.dailyGoal || 20;
        const today = todayISO();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = yesterday.toISOString().slice(0, 10);
        const poolAll = Array.from(lexicon.value.keys());
        const p1 = [];
        poolAll.forEach((k) => {
          const pr = getProgress(k);
          const ent = lexicon.value.get(k);
          if (!ent) return;
          if (pr.lastSpellWrongDay === yKey) p1.push(ent.word);
          if (pr.nextDue <= today && pr.lastResult) p1.push(ent.word);
        });
        const p2 = (state.value.tempWords || []).filter((w) => lexicon.value.has(normWord(w)));
        const p3 = poolAll.filter((k) => !getProgress(k).lastResult);
        const uniq = (arr) => {
          const s = new Set();
          const o = [];
          arr.forEach((w) => { const n = normWord(w); if (!s.has(n)) { s.add(n); o.push(w); } });
          return o;
        };
        let q = uniq(p1.map((w) => normWord(w)));
        q = q.map((k) => lexicon.value.get(k)).filter(Boolean);
        q.sort((a, b) => (state.value.wrongBook[normWord(b.word)]?.wrongCount || 0) - (state.value.wrongBook[normWord(a.word)]?.wrongCount || 0));
        if (q.length > goal) q = q.slice(0, goal);
        let need = goal - q.length;
        if (need > 0) {
          const add = uniq(p2.map(normWord)).map((k) => lexicon.value.get(k)).filter((e) => e && !q.find((x) => normWord(x.word) === normWord(e.word)));
          q = q.concat(add.slice(0, need));
          need = goal - q.length;
        }
        if (need > 0) {
          const have = new Set(q.map((e) => normWord(e.word)));
          const add = [];
          for (let i = 0; i < p3.length && add.length < need; i++) {
            const k = p3[i];
            if (!have.has(k)) { have.add(k); const e = lexicon.value.get(k); if (e) add.push(e); }
          }
          q = q.concat(add);
        }
        return q.length ? q : buildPoolForDeck().slice(0, goal);
      }

      function startSession(mode) {
        if (lexiconBundlesLoading.value) {
          showToast('词库正在加载，请稍候');
          return;
        }
        sessionReviewAlternate.value = false;
        sessionMode.value = mode;
        metaChoice.value = null;
        uncertain.value = false;
        if (mode === 'daily') sessionQueue.value = buildDailyQueue();
        else if (mode === 'wrong') {
          sessionQueue.value = wrongList.value.map((w) => lexicon.value.get(normWord(w.word))).filter(Boolean);
          if (!sessionQueue.value.length) { showToast('暂无错题'); return; }
        } else if (mode === 'notebook') {
          sessionQueue.value = (state.value.notebook || []).map((k) => lexicon.value.get(normWord(k))).filter(Boolean);
          if (!sessionQueue.value.length) { showToast('生词本为空'); return; }
        } else sessionQueue.value = buildPoolForDeck();
        sessionIndex.value = 0;
        studyStart.value = Date.now();
        if (!sessionQueue.value.length) { showToast('词库为空'); return; }
        view.value = 'learn';
        resetHints();
        scheduleMetaHint();
        maybeAutoSpeak();
      }

      function confirmLeaveStudy() {
        modalExitText.value = '确定退出学习？当前队列进度会保留。';
        modalExit.value = true;
        window.__wwLeaveCb = () => {
          sessionReviewAlternate.value = false;
          view.value = 'home';
        };
      }

      function modalExitOk() {
        modalExit.value = false;
        if (typeof window.__wwLeaveCb === 'function') {
          window.__wwLeaveCb();
          window.__wwLeaveCb = null;
        }
      }

      function scheduleMetaHint() {
        clearTimeout(metaTimer.value);
        hintLevel.value = 0;
        metaTimer.value = setTimeout(() => { if (view.value === 'learn') hintLevel.value = 1; }, 5000);
      }

      function resetHints() {
        hintLevel.value = 0;
        hintImage.value = '';
        spellInput.value = '';
        spellHinted.value = false;
        quiz.value = null;
        lastResult.value = null;
      }

      function maybeAutoSpeak() {
        nextTick(() => {
          if (!state.value.settings.autoSpeak) return;
          const e = currentEntry.value;
          if (e && (view.value === 'learn' || view.value === 'quiz')) speak(e.word, state.value.settings.accent);
        });
      }

      function speak(text, accent) {
        try {
          const t = String(text || '').trim();
          if (!t) return;
          if (typeof speechSynthesis !== 'undefined' && speechSynthesis.resume) {
            try { speechSynthesis.resume(); } catch (_) {}
          }
          const u = new SpeechSynthesisUtterance(t);
          u.lang = accent === 'UK' ? 'en-GB' : 'en-US';
          u.rate = 0.92;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        } catch (_) {
          showToast('无法朗读（请再点一次发音按钮，或检查系统是否关闭 TTS）');
        }
      }

      function toggleStar(word) {
        const k = normWord(word);
        if (state.value.starred[k]) delete state.value.starred[k];
        else state.value.starred[k] = true;
        const pr = getProgress(word);
        pr.familiar = !!state.value.starred[k];
        persist();
      }

      function isStarred(word) {
        return !!state.value.starred[normWord(word)];
      }

      function onMeta(kind) {
        clearTimeout(metaTimer.value);
        metaChoice.value = kind;
        uncertain.value = kind === 'unsure';
        const e = currentEntry.value;
        if (kind === 'unknown') {
          uncertain.value = false;
          detailEntry.value = e;
          detailHighlightIdx.value = 0;
          noteDraft.value = state.value.notes[normWord(e.word)] || '';
          feedbackImage.value = placeholderImg();
          fetchImageFor(e.word).then((u) => { feedbackImage.value = u; });
          view.value = 'unk';
          maybeAutoSpeak();
          return;
        }
        resetHints();
        view.value = 'quiz';
        if (kind === 'know') {
          if (sessionReviewAlternate.value) buildQuiz('zh2word');
          else buildQuiz('word2zh');
        } else if (kind === 'unsure') {
          if (sessionReviewAlternate.value) buildQuiz('listen2zh');
          else buildNextQuizType();
        } else buildNextQuizType();
        scheduleMetaHint();
        maybeAutoSpeak();
      }

      function afterUnknownCard() {
        bumpStats('learn');
        persist();
        resetHints();
        view.value = 'quiz';
        buildQuiz('spell');
        maybeAutoSpeak();
      }

      function buildNextQuizType() {
        const e = currentEntry.value;
        const mode = state.value.settings.masteryMode;
        const roll = Math.random();
        if (mode === 'dictation') {
          buildQuiz(roll < 0.85 ? 'spell' : 'word2zh');
          return;
        }
        if (mode === 'cognitive') {
          const pool = ['word2zh', 'zh2word', 'multisense'];
          buildQuiz(pool[(roll * pool.length) | 0]);
          return;
        }
        const pool = ['word2zh', 'zh2word', 'multisense', 'listen2zh', 'spell'];
        buildQuiz(pool[(roll * pool.length) | 0]);
      }

      function buildQuiz(type) {
        const e = currentEntry.value;
        const poolWords = shuffle(Array.from(lexicon.value.keys()));
        const distractors = pickDistractors(e, poolWords, lexicon.value, 3);
        const correctSense = firstSense(e.translation);
        if (type === 'word2zh' || type === 'listen2zh') {
          const opts = shuffle([
            { pos: correctSense.pos || '释义', text: correctSense.text, ok: true },
            ...distractors.map((d) => {
              const s = firstSense(d.translation);
              return { pos: s.pos || '释义', text: s.text, ok: false };
            })
          ]);
          quiz.value = { type, options: opts, locked: false, picked: null, wrongStreak: 0 };
        } else if (type === 'zh2word') {
          const opts = shuffle([
            { word: e.word, ok: true },
            ...distractors.map((d) => ({ word: d.word, ok: false }))
          ]);
          quiz.value = {
            type,
            zhPrompt: `${correctSense.pos || ''} ${correctSense.text}`.trim(),
            options: opts,
            locked: false,
            picked: null,
            wrongStreak: 0
          };
        } else if (type === 'multisense') {
          const senses = allSenses(e.translation);
          const nCor = Math.min(2, Math.max(1, senses.length));
          const correct = senses.slice(0, nCor);
          const needFake = Math.min(4 - correct.length, distractors.length);
          const fake = distractors.slice(0, needFake).map((d) => firstSense(d.translation));
          const opts = shuffle([
            ...correct.map((s) => ({ pos: s.pos, text: s.text, ok: true })),
            ...fake.map((s) => ({ pos: s.pos || '释义', text: s.text, ok: false }))
          ]);
          quiz.value = { type, options: opts, locked: false, pickedMulti: [] };
        } else if (type === 'spell') {
          quiz.value = { type, locked: false };
        }
      }

      function showHint() {
        if (hintLevel.value < 1) hintLevel.value = 1;
        else if (hintLevel.value < 2) {
          hintLevel.value = 2;
          loadHintImage();
        } else speak(currentEntry.value.word, state.value.settings.accent);
      }

      function loadHintImage() {
        const w = currentEntry.value && currentEntry.value.word;
        if (!w) return;
        apiLoading.value = true;
        const url = `https://api.apihz.cn/getapi.php?id=88888888&key=88888888&keyword=${encodeURIComponent(w)}&num=1`;
        fetchJSON(url, 6000)
          .then((j) => {
            const u = parseHzImage(j);
            hintImage.value = u || placeholderImg();
          })
          .catch(() => { hintImage.value = placeholderImg(); })
          .finally(() => { apiLoading.value = false; });
      }

      function placeholderImg() {
        return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="#e8e0dc" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="18">${APP_NAME}</text></svg>`);
      }

      function fetchImageFor(word) {
        const url = `https://api.apihz.cn/getapi.php?id=88888888&key=88888888&keyword=${encodeURIComponent(word)}&num=1`;
        return fetchJSON(url, 6000)
          .then((j) => {
            const u = parseHzImage(j);
            return u || placeholderImg();
          })
          .catch(() => placeholderImg());
      }

      function ensureWrongBookEntry(e, bumpCount) {
        const wk = normWord(e.word);
        if (!state.value.wrongBook[wk]) {
          state.value.wrongBook[wk] = { wrongCount: 0, correctStreak: 0, translation: e.translation, display: e.word };
        }
        if (bumpCount) state.value.wrongBook[wk].wrongCount++;
      }

      function openDetailAfterThreeStrikes() {
        const e = currentEntry.value;
        if (!e) return;
        ensureWrongBookEntry(e, true);
        const pr = getProgress(e.word);
        pr.consecutiveWrong = (pr.consecutiveWrong || 0) + 1;
        detailEntry.value = e;
        detailTab.value = 'def';
        detailHighlightIdx.value = 0;
        noteDraft.value = state.value.notes[normWord(e.word)] || '';
        detailReturnView.value = 'quiz';
        detailFromStrikes.value = true;
        detailScreenImage.value = placeholderImg();
        fetchImageFor(e.word).then((u) => { detailScreenImage.value = u; });
        view.value = 'detail';
        persist();
      }

      function continueQuizSameWord() {
        detailFromStrikes.value = false;
        detailScreenImage.value = '';
        detailReturnView.value = null;
        view.value = 'quiz';
        resetHints();
        if (sessionReviewAlternate.value && metaChoice.value === 'know') buildQuiz('zh2word');
        else if (sessionReviewAlternate.value && metaChoice.value === 'unsure') buildQuiz('listen2zh');
        else if (metaChoice.value === 'know') buildQuiz('word2zh');
        else if (metaChoice.value === 'unsure') buildNextQuizType();
        else buildQuiz('word2zh');
        maybeAutoSpeak();
      }

      function nextWordFromDetail() {
        detailFromStrikes.value = false;
        detailScreenImage.value = '';
        const ret = detailReturnView.value;
        detailReturnView.value = null;
        if (ret === 'feedback') {
          nextAfterFeedback();
          return;
        }
        if (ret === 'quiz') {
          metaChoice.value = null;
          uncertain.value = false;
          if (sessionIndex.value < sessionQueue.value.length - 1) {
            sessionIndex.value++;
            view.value = 'learn';
            resetHints();
            scheduleMetaHint();
            maybeAutoSpeak();
          } else {
            sessionReviewAlternate.value = false;
            view.value = 'home';
          }
          return;
        }
        if (sessionIndex.value < sessionQueue.value.length - 1) {
          sessionIndex.value++;
          metaChoice.value = null;
          uncertain.value = false;
          view.value = 'learn';
          resetHints();
          scheduleMetaHint();
          maybeAutoSpeak();
        } else {
          view.value = 'home';
        }
      }

      function choiceClass(i) {
        if (!quiz.value || quiz.value.locked === false) return {};
        const o = quiz.value.options[i];
        const picked = quiz.value.picked === i;
        return {
          right: o.ok,
          wrong: picked && !o.ok,
          selected: picked || (o.ok && quiz.value.locked)
        };
      }

      function multiClass(i) {
        if (!quiz.value) return {};
        const arr = quiz.value.pickedMulti || [];
        return { selected: arr.includes(i) };
      }

      function toggleMulti(i) {
        if (!quiz.value || quiz.value.locked) return;
        const arr = quiz.value.pickedMulti || [];
        const j = arr.indexOf(i);
        if (j >= 0) arr.splice(j, 1);
        else arr.push(i);
        quiz.value.pickedMulti = arr.slice();
      }

      function pickChoice(i) {
        if (!quiz.value || quiz.value.locked) return;
        const qz = quiz.value;
        const t = qz.type;
        const o = qz.options[i];
        const ok = o.ok;
        const fourChoice = t === 'word2zh' || t === 'zh2word' || t === 'listen2zh';
        if (!fourChoice) {
          qz.picked = i;
          qz.locked = true;
          finishQuiz(ok, qz.options.find((x) => x.ok));
          return;
        }
        if (ok) {
          qz.picked = i;
          qz.locked = true;
          finishQuiz(true, o);
          return;
        }
        qz.wrongStreak = (qz.wrongStreak || 0) + 1;
        qz.picked = i;
        qz.locked = true;
        if (qz.wrongStreak >= 3) {
          openDetailAfterThreeStrikes();
          return;
        }
        setTimeout(() => {
          if (!quiz.value || quiz.value !== qz) return;
          qz.locked = false;
          qz.picked = null;
        }, 700);
      }

      function submitMulti() {
        if (!quiz.value || quiz.value.locked) return;
        const correctIdx = quiz.value.options.map((o, idx) => (o.ok ? idx : -1)).filter((x) => x >= 0);
        const picked = quiz.value.pickedMulti || [];
        const ok = correctIdx.length && correctIdx.every((idx) => picked.includes(idx)) && picked.length === correctIdx.length;
        quiz.value.locked = true;
        finishQuiz(ok, { text: '所有正确义项' });
      }

      function submitSpell() {
        if (!quiz.value || quiz.value.locked) return;
        const w = normWord(spellInput.value);
        const ok = w === normWord(currentEntry.value.word);
        quiz.value.locked = true;
        finishQuiz(ok, { text: currentEntry.value.word });
      }

      function spellHintFirst() {
        spellHinted.value = true;
      }

      function finishQuiz(correct, expected) {
        const e = currentEntry.value;
        const pr = getProgress(e.word);
        const d = todayISO();
        const prevOk = pr.lastResult === 'ok';
        const dueForgot = (pr.nextDue || d) <= d;
        pr.studyByDay[d] = (pr.studyByDay[d] || 0) + 1;
        lastResult.value = { correct, expected: expected && (expected.text || expected.word) };
        feedbackImage.value = placeholderImg();
        fetchImageFor(e.word).then((u) => { feedbackImage.value = u; });
        if (!correct) {
          pr.wrongByDay[d] = (pr.wrongByDay[d] || 0) + 1;
          pr.consecutiveWrong = (pr.consecutiveWrong || 0) + 1;
          const wk = normWord(e.word);
          if (!state.value.wrongBook[wk]) state.value.wrongBook[wk] = { wrongCount: 0, correctStreak: 0, translation: e.translation, display: e.word };
          state.value.wrongBook[wk].wrongCount++;
          state.value.wrongBook[wk].correctStreak = 0;
          if (prevOk && dueForgot && (pr.intervalIdx || 0) > 0) {
            state.value.wrongBook[wk].wrongCount++;
          }
          if (pr.consecutiveWrong >= 5) ensureWrongBookEntry(e, false);
          pr.intervalIdx = 0;
          pr.nextDue = d;
          pr.lastSpellWrongDay = d;
          pr.knowPassDays = [];
        } else {
          pr.consecutiveWrong = 0;
          const wk = normWord(e.word);
          const wb = state.value.wrongBook[wk];
          if (wb) {
            wb.correctStreak = (wb.correctStreak || 0) + 1;
            if (wb.correctStreak >= 2) delete state.value.wrongBook[wk];
          }
          if (!uncertain.value && metaChoice.value === 'know' && correct) {
            const arr = pr.knowPassDays || [];
            if (!arr.includes(d)) arr.push(d);
            pr.knowPassDays = arr.slice(-12);
            const uniqDays = [...new Set(arr)];
            if (uniqDays.length >= 2) pr.mastered = true;
          }
          if (!pr.mastered) {
            pr.intervalIdx = Math.min(INTERVALS.length - 1, (pr.intervalIdx || 0) + (uncertain.value ? 0 : 1));
            const days = INTERVALS[pr.intervalIdx] || 1;
            const dt = new Date();
            dt.setDate(dt.getDate() + days);
            pr.nextDue = dt.toISOString().slice(0, 10);
          }
        }
        pr.lastResult = correct ? 'ok' : 'bad';
        bumpStats('review');
        view.value = 'feedback';
        clearTimeout(metaTimer.value);
        persist();
      }

      function nextAfterFeedback() {
        const e = currentEntry.value;
        const minutes = (Date.now() - (studyStart.value || Date.now())) / 60000;
        addMinutes(Math.max(0.2, minutes / Math.max(1, sessionIndex.value + 1)));
        if (sessionIndex.value >= sessionQueue.value.length - 1) {
          const goal = state.value.settings.dailyGoal;
          const learned = todayLearned.value;
          const ok = learned >= goal;
          modalExitText.value = ok
            ? `🎉 真是充实的一天！你学习了约 ${Math.round(minutes)} 分钟，今日已完成目标。`
            : `💪 今日任务尚不达标，还有约 ${Math.max(0, goal - learned)} 个单词在等你。`;
          modalExit.value = true;
          window.__wwLeaveCb = () => {
            sessionReviewAlternate.value = false;
            view.value = 'home';
          };
          return;
        }
        sessionIndex.value++;
        metaChoice.value = null;
        uncertain.value = false;
        view.value = 'learn';
        resetHints();
        scheduleMetaHint();
        maybeAutoSpeak();
      }

      function tryMorningReview() {
        if (lexiconBundlesLoading.value) return;
        const t = todayISO();
        if (state.value.morningReviewPromptDate === t) return;
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yKey = y.toISOString().slice(0, 10);
        const heavy = [];
        lexicon.value.forEach((ent, k) => {
          if (!ent) return;
          const pr = getProgress(k);
          const n = pr.studyByDay[yKey] || 0;
          if (n >= 3) heavy.push(ent);
        });
        if (!heavy.length) return;
        state.value.morningReviewPromptDate = t;
        persist();
        sessionReviewAlternate.value = true;
        sessionMode.value = 'morning';
        metaChoice.value = null;
        uncertain.value = false;
        sessionQueue.value = shuffle(heavy).slice(0, Math.min(heavy.length, state.value.settings.dailyGoal || 20));
        sessionIndex.value = 0;
        studyStart.value = Date.now();
        view.value = 'learn';
        resetHints();
        scheduleMetaHint();
        showToast('昨日高强度单词：今日已切换题型复习');
        maybeAutoSpeak();
      }

      function openDetailFromFeedback() {
        detailEntry.value = currentEntry.value;
        detailTab.value = 'def';
        detailHighlightIdx.value = 0;
        noteDraft.value = state.value.notes[normWord(detailEntry.value.word)] || '';
        detailReturnView.value = 'feedback';
        detailFromStrikes.value = false;
        detailScreenImage.value = placeholderImg();
        fetchImageFor(detailEntry.value.word).then((u) => { detailScreenImage.value = u; });
        view.value = 'detail';
      }

      function closeDetail() {
        detailScreenImage.value = '';
        const ret = detailReturnView.value;
        detailReturnView.value = null;
        detailFromStrikes.value = false;
        if (ret === 'feedback') {
          view.value = 'feedback';
          return;
        }
        if (ret === 'quiz') {
          continueQuizSameWord();
          return;
        }
        view.value = sessionQueue.value.length ? 'learn' : 'home';
      }

      function saveNote() {
        if (!detailEntry.value) return;
        const k = normWord(detailEntry.value.word);
        state.value.notes[k] = noteDraft.value;
        persist();
      }

      function lookupQuick(w) {
        searchQ.value = w;
        runSearch();
        view.value = 'search';
      }

      function runSearch() {
        const q = normWord(searchQ.value);
        if (!q) return;
        searchError.value = '';
        searchResult.value = null;
        const local = lexicon.value.get(q);
        if (local) {
          searchResult.value = local;
          addTempSearch(q);
          return;
        }
        searchLoading.value = true;
        const url = `http://124.222.204.22/api/zici/fanyiapihz.php?id=88888888&key=88888888&word=${encodeURIComponent(q)}`;
        fetchJSON(url, 8000)
          .then((j) => {
            const zh = (j && (j.translation || j.data || j.result || j.msg)) || '';
            if (!zh) { searchError.value = '未找到释义'; return; }
            const ent = { word: q, phonetic: '', translation: String(zh), definition: '', exchange: '', pos: '', synonyms: '', rootAffix: '' };
            lexicon.value.set(q, ent);
            searchResult.value = ent;
            state.value.lexiconExtra.push(ent);
            addTempSearch(q);
            persist();
          })
          .catch(() => { searchError.value = '网络超时或接口不可用'; })
          .finally(() => { searchLoading.value = false; });
      }

      function addTempSearch(w) {
        const k = normWord(w);
        if (!state.value.tempWords.includes(k)) state.value.tempWords.push(k);
        persist();
      }

      function addNotebook(w) {
        const k = normWord(w);
        if (!state.value.notebook.includes(k)) state.value.notebook.push(k);
        persist();
        showToast('已加入生词本');
      }

      function exportWrong(mode) {
        const rows = wrongList.value;
        const esc = (s) => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const m = mode || 'both';
        let head;
        let body;
        if (m === 'en') {
          head = '<tr><th>英文</th></tr>';
          body = rows.map((r) => `<tr><td>${esc(r.word)}</td></tr>`).join('');
        } else if (m === 'zh') {
          head = '<tr><th>中文释义</th></tr>';
          body = rows.map((r) => `<tr><td>${esc(r.translation)}</td></tr>`).join('');
        } else {
          head = '<tr><th>英文</th><th>释义</th><th>错误次数</th></tr>';
          body = rows.map((r) => `<tr><td>${esc(r.word)}</td><td>${esc(r.translation)}</td><td>${r.wrongCount}</td></tr>`).join('');
        }
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${APP_NAME} 错题</title>
          <style>body{font-family:system-ui;padding:24px;}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body>
          <h1>${APP_NAME} · 错题导出</h1><table>${head}${body}</table>
          <script>window.onload=function(){window.print()}<\/script></body></html>`;
        const w = window.open('', '_blank');
        if (w) { w.document.write(html); w.document.close(); }
        else showToast('请允许弹窗以导出');
      }

      function refreshStats() {
        showToast('数据已刷新');
      }

      function saveSettings() {
        persist();
        showToast('设置已保存');
        view.value = 'home';
      }

      function mergeLexicon(entries) {
        const m = new Map(lexicon.value);
        entries.forEach((e) => {
          const ent = {
            ...e,
            synonyms: e.synonyms != null ? e.synonyms : '',
            rootAffix: e.rootAffix != null ? e.rootAffix : ''
          };
          m.set(normWord(ent.word), ent);
          if (!state.value.lexiconExtra.find((x) => normWord(x.word) === normWord(ent.word))) state.value.lexiconExtra.push(ent);
        });
        lexicon.value = m;
        persist();
      }

      function onCsvFile(ev) {
        const f = ev.target.files && ev.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const rows = parseCSV(String(reader.result || ''));
            const ent = rowsToEntries(rows);
            mergeLexicon(ent);
            persist();
            showToast(`已导入 ${ent.length} 条`);
          } catch {
            showToast('CSV 解析失败');
          }
        };
        reader.readAsText(f, 'UTF-8');
      }

      onMounted(() => {
        const ex = state.value.lexiconExtra || [];
        if (ex.length) lexicon.value = buildLexiconMap(SAMPLE_LEXICON.concat(ex));
        lexiconBundlesLoading.value = true;
        Promise.all([
          fetchJSON('./data/lexicon-cet4.json', 90000),
          fetchJSON('./data/lexicon-cet6.json', 90000)
        ])
          .then(([p4, p6]) => {
            const e4 = entriesFromCetPack(p4);
            const e6 = entriesFromCetPack(p6);
            const m = new Map(lexicon.value);
            e4.forEach((ent) => { m.set(normWord(ent.word), ent); });
            e6.forEach((ent) => { m.set(normWord(ent.word), ent); });
            lexicon.value = m;
            if (p4 && p4.name) decks.cet4.name = p4.name;
            if (p6 && p6.name) decks.cet6.name = p6.name;
            decks.cet4.desc = '大学英语四级词库';
            decks.cet6.desc = '大学英语六级词库';
            const order4 = e4.map((x) => x.word);
            const order6 = e6.map((x) => x.word);
            decks.cet4.words = order4;
            decks.cet6.words = order6;
            const seen = new Set();
            const combo = [];
            for (const w of order4) {
              const k = normWord(w);
              if (!seen.has(k)) { seen.add(k); combo.push(w); }
            }
            for (const w of order6) {
              const k = normWord(w);
              if (!seen.has(k)) { seen.add(k); combo.push(w); }
            }
            decks.shuffle.desc = '四级+六级综合词库';
            decks.shuffle.words = combo;
          })
          .catch(() => {
            showToast('四六级词库文件加载失败，将使用内置示例');
            decks.cet4.desc = '内置示例词表（加载失败回退）';
            decks.cet6.desc = '内置示例词表（加载失败回退）';
            decks.shuffle.desc = '内置示例词表（加载失败回退）';
          })
          .finally(() => {
            lexiconBundlesLoading.value = false;
            try {
              const blob = new Blob([document.getElementById('wordwise-manifest-json').textContent], { type: 'application/json' });
              const u = URL.createObjectURL(blob);
              let link = document.querySelector('link[rel="manifest"]');
              if (!link) { link = document.createElement('link'); link.rel = 'manifest'; document.head.appendChild(link); }
              link.href = u;
            } catch (_) {}
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('wordwise-sw.js').catch(() => {});
            }
            tryMorningReview();
          });
      });

      return {
        view,
        toast,
        settings,
        deckKeys,
        decks,
        lexiconSize,
        signedToday,
        streak,
        signQuote,
        calDays,
        todayLearned,
        weekRemain,
        weekProgressPct,
        todayStats,
        weekBars,
        maxBar,
        wrongList,
        sessionQueue,
        sessionIndex,
        currentEntry,
        quiz,
        quizModeLabel,
        hintLevel,
        hintImage,
        spellInput,
        spellPlaceholder,
        lastResult,
        feedbackImage,
        highlightExample,
        exampleSentence,
        exampleTranslation,
        detailEntry,
        detailTab,
        detailHighlightIdx,
        detailDefLines,
        detailCollocations,
        relatedWords,
        detailSynonymsLine,
        detailRootAffixLine,
        detailScreenImage,
        detailFromStrikes,
        fold,
        noteDraft,
        searchQ,
        searchResult,
        searchError,
        searchLoading,
        apiLoading,
        modalExit,
        modalExitText,
        modalExitOk,
        afterUnknownCard,
        doSignIn,
        selectDeck,
        pickPlanRows,
        pickPlanSearchQ,
        pickPlanSearchLoading,
        pickPlanSearchOnline,
        togglePickAll,
        startPickedPlan,
        calTouchStart,
        calTouchEnd,
        calendarOffset,
        continueQuizSameWord,
        nextWordFromDetail,
        deckWordCount,
        startSession,
        confirmLeaveStudy,
        onMeta,
        pickChoice,
        toggleMulti,
        submitMulti,
        submitSpell,
        spellHintFirst,
        choiceClass,
        multiClass,
        showHint,
        nextAfterFeedback,
        speak,
        toggleStar,
        isStarred,
        closeDetail,
        openDetailFromFeedback,
        saveNote,
        lookupQuick,
        runSearch,
        addTempSearch,
        addNotebook,
        exportWrong,
        refreshStats,
        saveSettings,
        onCsvFile,
        persist,
        lexiconBundlesLoading
      };
    }
  }).mount('#app');
})();
