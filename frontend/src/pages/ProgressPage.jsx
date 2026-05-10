import { useState, useEffect } from 'react';
import { progressApi } from '../api';
import { getSessionId, LEVEL_COLORS, JLPT_LEVELS } from '../utils';
import './ProgressPage.css';

export default function ProgressPage() {
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sessionId = getSessionId();

  useEffect(() => {
    let cancelled = false;
    Promise.all([progressApi.getSummary(sessionId), progressApi.getBySession(sessionId)])
      .then(([sumRes, detailRes]) => {
        if (!cancelled) {
          setLoading(false);
          setSummary(sumRes.data);
          setDetails(detailRes.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading(false);
          setError('ไม่สามารถโหลดข้อมูลได้ กรุณาเชื่อมต่อ Backend');
          console.error(err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handleClear = () => {
    if (!window.confirm('ล้างข้อมูลความคืบหน้าทั้งหมด?')) return;
    progressApi
      .clearProgress(sessionId)
      .then(() => {
        setSummary({ totalAnswered: 0, totalCorrect: 0, totalIncorrect: 0, accuracy: 0 });
        setDetails([]);
      })
      .catch(() => alert('ล้างข้อมูลไม่สำเร็จ'));
  };

  // Group details by jlptLevel
  const grouped = {};
  details.forEach((rec) => {
    const lvl = rec.vocabularyId?.jlptLevel || 'N/A';
    if (!grouped[lvl]) grouped[lvl] = [];
    grouped[lvl].push(rec);
  });

  return (
    <div className="progress-page">
      <div className="progress-header">
        <div>
          <h1 className="page-title">�� ความคืบหน้า</h1>
          <p className="page-subtitle">บันทึกผลการฝึกคำศัพท์ของคุณ</p>
        </div>
        {details.length > 0 && (
          <button className="btn btn-outline-red" onClick={handleClear}>
            🗑️ ล้างข้อมูล
          </button>
        )}
      </div>

      {loading && <div className="loading-msg">กำลังโหลด...</div>}
      {error && <div className="error-msg">⚠️ {error}</div>}

      {!loading && !error && summary && (
        <>
          <div className="summary-cards">
            <div className="summary-card total">
              <span className="summary-number">{summary.totalAnswered}</span>
              <span className="summary-label">คำที่ตอบแล้ว</span>
            </div>
            <div className="summary-card correct">
              <span className="summary-number">{summary.totalCorrect}</span>
              <span className="summary-label">ตอบถูก</span>
            </div>
            <div className="summary-card incorrect">
              <span className="summary-number">{summary.totalIncorrect}</span>
              <span className="summary-label">ตอบผิด</span>
            </div>
            <div className="summary-card accuracy">
              <span className="summary-number">{summary.accuracy}%</span>
              <span className="summary-label">ความแม่นยำ</span>
            </div>
          </div>

          {summary.totalAnswered > 0 && (
            <div className="accuracy-bar-wrap">
              <div className="accuracy-bar-bg">
                <div
                  className="accuracy-bar-fill"
                  style={{ width: `${summary.accuracy}%` }}
                />
              </div>
              <span className="accuracy-bar-label">{summary.accuracy}% ความแม่นยำ</span>
            </div>
          )}

          {details.length === 0 ? (
            <div className="empty-progress">
              <div className="empty-icon">🃏</div>
              <p>ยังไม่มีบันทึกการฝึก กลับไปฝึกคำศัพท์กันเถอะ!</p>
              <a href="/" className="btn btn-primary">ฝึกคำศัพท์</a>
            </div>
          ) : (
            <div className="level-sections">
              {JLPT_LEVELS.filter((lvl) => grouped[lvl]).map((lvl) => (
                <div key={lvl} className="level-section">
                  <div
                    className="level-section-header"
                    style={{ borderLeft: `4px solid ${LEVEL_COLORS[lvl]}` }}
                  >
                    <span className="level-badge" style={{ background: LEVEL_COLORS[lvl] }}>
                      {lvl}
                    </span>
                    <span className="level-count">{grouped[lvl].length} คำ</span>
                  </div>
                  <div className="detail-table-wrap">
                    <table className="detail-table">
                      <thead>
                        <tr>
                          <th>คำศัพท์</th>
                          <th>การอ่าน</th>
                          <th>ภาษาไทย</th>
                          <th>โหมด</th>
                          <th>ถูก</th>
                          <th>ผิด</th>
                          <th>ความแม่นยำ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[lvl].map((rec) => {
                          const total = rec.correct + rec.incorrect;
                          const acc = total > 0 ? Math.round((rec.correct / total) * 100) : 0;
                          return (
                            <tr key={rec._id}>
                              <td className="jp-cell">{rec.vocabularyId?.japanese || '-'}</td>
                              <td className="reading-cell">{rec.vocabularyId?.reading || '-'}</td>
                              <td>{rec.vocabularyId?.thai || '-'}</td>
                              <td>
                                <span className="mode-chip">
                                  {rec.mode === 'thai-to-japanese' ? '🇹🇭→🇯🇵' : '🇯🇵→🇹🇭'}
                                </span>
                              </td>
                              <td className="correct-cell">{rec.correct}</td>
                              <td className="incorrect-cell">{rec.incorrect}</td>
                              <td>
                                <div className="mini-acc">
                                  <div className="mini-bar-bg">
                                    <div
                                      className="mini-bar-fill"
                                      style={{
                                        width: `${acc}%`,
                                        background:
                                          acc >= 70
                                            ? '#27ae60'
                                            : acc >= 40
                                            ? '#f39c12'
                                            : '#e74c3c',
                                      }}
                                    />
                                  </div>
                                  <span>{acc}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
