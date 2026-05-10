import { MODES } from '../utils';
import './Flashcard.css';

export default function Flashcard({ card, mode, isFlipped, onFlip, onAnswer }) {
  const isThaiToJP = mode === MODES.THAI_TO_JAPANESE;

  // Front side (question)
  const frontLabel = isThaiToJP ? 'ภาษาไทย' : 'ภาษาญี่ปุ่น';
  const frontContent = isThaiToJP ? card.thai : card.japanese;
  const frontReading = isThaiToJP ? null : card.reading;

  // Back side (answer)
  const backLabel = isThaiToJP ? 'ภาษาญี่ปุ่น' : 'ภาษาไทย';
  const backContent = isThaiToJP ? card.japanese : card.thai;
  const backReading = isThaiToJP ? card.reading : null;

  return (
    <div className="flashcard-wrapper">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="card-face card-front">
          <div className="card-badge">{card.jlptLevel}</div>
          <div className="card-label">{frontLabel}</div>
          <div className="card-word">{frontContent}</div>
          {frontReading && <div className="card-reading">{frontReading}</div>}
          {card.partOfSpeech && <div className="card-pos">{card.partOfSpeech}</div>}
          {!isFlipped && (
            <button className="flip-btn" onClick={onFlip}>
              แสดงคำตอบ 👁
            </button>
          )}
        </div>

        {/* Back */}
        <div className="card-face card-back">
          <div className="card-badge">{card.jlptLevel}</div>
          <div className="card-question-recap">
            <span className="recap-label">คำถาม:</span>
            <span className="recap-word">{frontContent}</span>
          </div>
          <div className="card-divider" />
          <div className="card-label">{backLabel}</div>
          <div className="card-word answer-word">{backContent}</div>
          {backReading && <div className="card-reading">{backReading}</div>}
          {card.example?.japanese && (
            <div className="card-example">
              <div className="example-label">ตัวอย่าง:</div>
              <div className="example-jp">{card.example.japanese}</div>
              {card.example.thai && <div className="example-th">{card.example.thai}</div>}
            </div>
          )}
          {isFlipped && (
            <div className="answer-buttons">
              <button className="answer-btn incorrect" onClick={() => onAnswer(false)}>
                ❌ ตอบผิด
              </button>
              <button className="answer-btn correct" onClick={() => onAnswer(true)}>
                ✅ ตอบถูก
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
