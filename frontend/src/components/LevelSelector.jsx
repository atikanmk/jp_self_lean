import { JLPT_LEVELS, LEVEL_COLORS } from '../utils';
import './LevelSelector.css';

export default function LevelSelector({ selected, onChange }) {
  return (
    <div className="level-selector">
      <span className="selector-label">ระดับ JLPT:</span>
      <div className="level-buttons">
        {JLPT_LEVELS.map((level) => (
          <button
            key={level}
            className={`level-btn ${selected === level ? 'active' : ''}`}
            style={selected === level ? { background: LEVEL_COLORS[level], borderColor: LEVEL_COLORS[level] } : {}}
            onClick={() => onChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
