import { MODES } from '../utils';
import './ModeSelector.css';

export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="mode-selector">
      <span className="selector-label">โหมด:</span>
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === MODES.THAI_TO_JAPANESE ? 'active' : ''}`}
          onClick={() => onChange(MODES.THAI_TO_JAPANESE)}
        >
          🇹🇭 ไทย → ญี่ปุ่น
        </button>
        <button
          className={`mode-btn ${mode === MODES.JAPANESE_TO_THAI ? 'active' : ''}`}
          onClick={() => onChange(MODES.JAPANESE_TO_THAI)}
        >
          🇯🇵 ญี่ปุ่น → ไทย
        </button>
      </div>
    </div>
  );
}
