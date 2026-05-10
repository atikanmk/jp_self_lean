import { useState, useEffect, useMemo } from 'react';
import { vocabularyApi } from '../api';
import { JLPT_LEVELS, LEVEL_COLORS } from '../utils';
import VocabForm from '../components/VocabForm';
import './VocabularyPage.css';

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    vocabularyApi
      .getAll()
      .then((res) => {
        if (!cancelled) {
          setLoading(false);
          setVocabulary(res.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoading(false);
          setError('ไม่สามารถโหลดคำศัพท์ได้');
          console.error(err);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = vocabulary;
    if (selectedLevel) result = result.filter((v) => v.jlptLevel === selectedLevel);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.japanese.toLowerCase().includes(q) ||
          v.thai.toLowerCase().includes(q) ||
          v.reading.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vocabulary, selectedLevel, search]);

  const reloadVocabulary = () => {
    setLoading(true);
    setError('');
    vocabularyApi
      .getAll()
      .then((res) => {
        setLoading(false);
        setVocabulary(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError('ไม่สามารถโหลดคำศัพท์ได้');
        console.error(err);
      });
  };

  const handleSave = (data, id) => {
    const request = id ? vocabularyApi.update(id, data) : vocabularyApi.create(data);
    return request
      .then(() => {
        reloadVocabulary();
        setShowForm(false);
        setEditItem(null);
      })
      .catch((err) => {
        throw new Error(err.response?.data?.error || 'บันทึกไม่สำเร็จ', { cause: err });
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ลบคำศัพท์นี้ออก?')) return;
    setDeletingId(id);
    vocabularyApi
      .delete(id)
      .then(() => {
        setVocabulary((prev) => prev.filter((v) => v._id !== id));
        setDeletingId(null);
      })
      .catch(() => {
        setDeletingId(null);
        alert('ลบไม่สำเร็จ');
      });
  };

  const openEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div className="vocab-page">
      <div className="vocab-header">
        <div>
          <h1 className="page-title">📚 จัดการคำศัพท์</h1>
          <p className="page-subtitle">เพิ่ม แก้ไข หรือลบคำศัพท์ JLPT</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
        >
          ➕ เพิ่มคำศัพท์
        </button>
      </div>

      {showForm && <VocabForm initialData={editItem} onSave={handleSave} onCancel={closeForm} />}

      <div className="vocab-filters">
        <div className="filter-levels">
          <button
            className={`level-btn ${selectedLevel === '' ? 'active-all' : ''}`}
            onClick={() => setSelectedLevel('')}
          >
            ทั้งหมด
          </button>
          {JLPT_LEVELS.map((lvl) => (
            <button
              key={lvl}
              className={`level-btn ${selectedLevel === lvl ? 'active' : ''}`}
              style={
                selectedLevel === lvl
                  ? { background: LEVEL_COLORS[lvl], borderColor: LEVEL_COLORS[lvl], color: 'white' }
                  : {}
              }
              onClick={() => setSelectedLevel(lvl === selectedLevel ? '' : lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="🔍 ค้นหาคำศัพท์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="loading-msg">กำลังโหลด...</div>}
      {error && <div className="error-msg">⚠️ {error}</div>}

      {!loading && !error && (
        <>
          <div className="vocab-count">{filtered.length} คำศัพท์</div>
          <div className="vocab-table-wrap">
            <table className="vocab-table">
              <thead>
                <tr>
                  <th>ระดับ</th>
                  <th>ภาษาญี่ปุ่น</th>
                  <th>การอ่าน</th>
                  <th>ภาษาไทย</th>
                  <th>ชนิดคำ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-row">
                      ไม่พบคำศัพท์
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span
                          className="level-tag"
                          style={{ background: LEVEL_COLORS[item.jlptLevel] }}
                        >
                          {item.jlptLevel}
                        </span>
                      </td>
                      <td className="jp-cell">{item.japanese}</td>
                      <td className="reading-cell">{item.reading}</td>
                      <td>{item.thai}</td>
                      <td className="pos-cell">{item.partOfSpeech || '-'}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn edit" onClick={() => openEdit(item)}>
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
