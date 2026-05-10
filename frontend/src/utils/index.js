// Generate or retrieve a session ID for anonymous progress tracking
export function getSessionId() {
  let sessionId = localStorage.getItem('jlpt_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('jlpt_session_id', sessionId);
  }
  return sessionId;
}

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export const LEVEL_COLORS = {
  N5: '#4caf50',
  N4: '#2196f3',
  N3: '#ff9800',
  N2: '#e91e63',
  N1: '#9c27b0',
};

export const MODES = {
  THAI_TO_JAPANESE: 'thai-to-japanese',
  JAPANESE_TO_THAI: 'japanese-to-thai',
};

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
