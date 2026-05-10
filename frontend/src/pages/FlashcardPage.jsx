import { useState, useEffect } from 'react';
import { vocabularyApi, progressApi } from '../api';
import { getSessionId, JLPT_LEVELS, LEVEL_COLORS, MODES, shuffleArray } from '../utils';
import Flashcard from '../components/Flashcard';
import LevelSelector from '../components/LevelSelector';
import ModeSelector from '../components/ModeSelector';
import './FlashcardPage.css';

export default function FlashcardPage() {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [mode, setMode] = useState(MODES.THAI_TO_JAPANESE);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sessionId = getSessionId();

  // Derive finished from state rather than tracking separately
  const finished = !loading && !error && cards.length > 0 && currentIndex >= cards.length;

  useEffect(() => {
    let cancelled = false;
    vocabularyApi
      .getAll({ level: selectedLevel })
      .then((res) => {
        if (!cancelled) {
          setError('');
          setLoading(false);
          setCards(shuffleArray(res.data));
          setCurrentIndex(0);
          setIsFlipped(false);
          setSessionStats({ correct: 0, incorrect: 0 });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading(false);
          setError('ไม่สามารถโหลดคำศัพท์ได้ กรุณาเชื่อมต่อ Backend');
          console.error(err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedLevel]);

  const reloadCards = () => {
    setLoading(true);
    setError('');
    vocabularyApi
      .getAll({ level: selectedLevel })
      .then((res) => {
        setError('');
        setLoading(false);
        setCards(shuffleArray(res.data));
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionStats({ correct: 0, incorrect: 0 });
      })
      .catch((err) => {
        setLoading(false);
        setError('ไม่สามารถโหลดคำศัพท์ได้ กรุณาเชื่อมต่อ Backend');
        console.error(err);
      });
  };

  const handleAnswer = (isCorrect) => {
    const card = cards[currentIndex];
    progressApi
      .recordAnswer({ sessionId, vocabularyId: card._id, isCorrect, mode })
      .catch((err) => console.warn('Could not record progress:', err));

    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
  };

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0;

  return (
    <div className="flashcard-page">
      <div className="controls-row">
        <LevelSelector selected={selectedLevel} onChange={setSelectedLevel} />
        <ModeSelector mode={mode} onChange={setMode} />
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>กำลังโหลดคำศัพท์...</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={reloadCards} className="btn btn-outline">
            ลองใหม่
          </button>
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="empty-state">
          <p>ไม่พบคำศัพท์ในระดับ {selectedLevel}</p>
          <a href="/vocabulary" className="btn btn-primary">
            ➕ เพิ่มคำศัพท์
          </a>
        </div>
      )}

      {!loading && !error && !finished && currentCard && (
        <>
          <div className="session-info">
            <div className="session-stats">
              <span className="stat correct">✅ {sessionStats.correct}</span>
              <span className="stat incorrect">❌ {sessionStats.incorrect}</span>
              <span className="stat total">
                📋 {currentIndex + 1} / {cards.length}
              </span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <Flashcard
            card={currentCard}
            mode={mode}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(true)}
            onAnswer={handleAnswer}
          />
        </>
      )}

      {finished && (
        <div className="finished-screen">
          <div className="finished-card">
            <div className="finished-emoji">🎉</div>
            <h2>ทำเสร็จแล้ว!</h2>
            <p className="finished-level">
              ระดับ{' '}
              <strong style={{ color: LEVEL_COLORS[selectedLevel] }}>{selectedLevel}</strong>
            </p>
            <div className="finished-stats">
              <div className="fstat correct">
                <span className="fstat-number">{sessionStats.correct}</span>
                <span className="fstat-label">ตอบถูก</span>
              </div>
              <div className="fstat incorrect">
                <span className="fstat-number">{sessionStats.incorrect}</span>
                <span className="fstat-label">ตอบผิด</span>
              </div>
              <div className="fstat accuracy">
                <span className="fstat-number">
                  {sessionStats.correct + sessionStats.incorrect > 0
                    ? Math.round(
                        (sessionStats.correct /
                          (sessionStats.correct + sessionStats.incorrect)) *
                          100
                      )
                    : 0}
                  %
                </span>
                <span className="fstat-label">ความแม่นยำ</span>
              </div>
            </div>
            <div className="finished-actions">
              <button onClick={handleRestart} className="btn btn-primary">
                🔄 ทำซ้ำ
              </button>
              <button
                onClick={() =>
                  setSelectedLevel(
                    JLPT_LEVELS[(JLPT_LEVELS.indexOf(selectedLevel) + 1) % JLPT_LEVELS.length]
                  )
                }
                className="btn btn-outline"
              >
                ⏭ ระดับถัดไป
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
