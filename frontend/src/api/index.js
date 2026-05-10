import seedData from '../data/vocabulary.json';

// ---- localStorage helpers ----
const VOCAB_KEY = 'jlpt_vocabulary';
const PROGRESS_KEY = 'jlpt_progress';

function loadVocabulary() {
  const raw = localStorage.getItem(VOCAB_KEY);
  if (raw) return JSON.parse(raw);
  // seed ครั้งแรก
  localStorage.setItem(VOCAB_KEY, JSON.stringify(seedData));
  return seedData;
}

function saveVocabulary(data) {
  localStorage.setItem(VOCAB_KEY, JSON.stringify(data));
}

function loadProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function ok(data) {
  return Promise.resolve({ data });
}

// ---- Vocabulary API ----
export const vocabularyApi = {
  getAll: ({ level, search } = {}) => {
    let result = loadVocabulary();
    if (level) result = result.filter((v) => v.jlptLevel === level);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.japanese.toLowerCase().includes(q) ||
          v.thai.toLowerCase().includes(q) ||
          v.reading.toLowerCase().includes(q)
      );
    }
    return ok(result);
  },

  getById: (id) => {
    const item = loadVocabulary().find((v) => v._id === id);
    return item ? ok(item) : Promise.reject(new Error('Not found'));
  },

  create: (data) => {
    const list = loadVocabulary();
    const newItem = { ...data, _id: String(Date.now()) };
    saveVocabulary([...list, newItem]);
    return ok(newItem);
  },

  update: (id, data) => {
    const list = loadVocabulary().map((v) => (v._id === id ? { ...v, ...data } : v));
    saveVocabulary(list);
    return ok(list.find((v) => v._id === id));
  },

  delete: (id) => {
    saveVocabulary(loadVocabulary().filter((v) => v._id !== id));
    return ok({});
  },
};

// ---- Progress API ----
export const progressApi = {
  // คืน records ต่อคำศัพท์ (aggregate) พร้อม populate vocabularyId
  getBySession: (sessionId) => {
    const records = loadProgress().filter((p) => p.sessionId === sessionId);
    const vocab = loadVocabulary();
    // group by vocabularyId + mode
    const map = {};
    records.forEach((p) => {
      const key = `${p.vocabularyId}__${p.mode}`;
      if (!map[key]) {
        const vocabItem = vocab.find((v) => v._id === p.vocabularyId) || null;
        map[key] = { _id: key, vocabularyId: vocabItem, mode: p.mode, correct: 0, incorrect: 0 };
      }
      if (p.isCorrect) map[key].correct++;
      else map[key].incorrect++;
    });
    return ok(Object.values(map));
  },

  getSummary: (sessionId) => {
    const records = loadProgress().filter((p) => p.sessionId === sessionId);
    const totalAnswered = records.length;
    const totalCorrect = records.filter((p) => p.isCorrect).length;
    const summary = {
      sessionId,
      totalAnswered,
      totalCorrect,
      totalIncorrect: totalAnswered - totalCorrect,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    };
    return ok(summary);
  },

  recordAnswer: ({ sessionId, vocabularyId, isCorrect, mode }) => {
    const list = loadProgress();
    const record = { _id: String(Date.now()), sessionId, vocabularyId, isCorrect, mode, createdAt: new Date().toISOString() };
    saveProgress([...list, record]);
    return ok(record);
  },

  clearProgress: (sessionId) => {
    saveProgress(loadProgress().filter((p) => p.sessionId !== sessionId));
    return ok({});
  },
};

export default {};
