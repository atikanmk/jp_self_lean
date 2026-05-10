import { useState } from 'react';
import { JLPT_LEVELS } from '../utils';
import './VocabForm.css';

const EMPTY = {
  japanese: '',
  reading: '',
  thai: '',
  jlptLevel: 'N5',
  partOfSpeech: '',
  example: { japanese: '', thai: '' },
};

export default function VocabForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(
    initialData
      ? {
          japanese: initialData.japanese || '',
          reading: initialData.reading || '',
          thai: initialData.thai || '',
          jlptLevel: initialData.jlptLevel || 'N5',
          partOfSpeech: initialData.partOfSpeech || '',
          example: {
            japanese: initialData.example?.japanese || '',
            thai: initialData.example?.thai || '',
          },
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const setExample = (field, value) =>
    setForm((prev) => ({ ...prev, example: { ...prev.example, [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.japanese || !form.reading || !form.thai) {
      setFormError('กรุณากรอกข้อมูล ภาษาญี่ปุ่น การอ่าน และ ภาษาไทย');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await onSave(form, initialData?._id);
    } catch (err) {
      setFormError(err.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="vocab-form-card">
        <div className="form-header">
          <h2>{initialData ? '✏️ แก้ไขคำศัพท์' : '➕ เพิ่มคำศัพท์ใหม่'}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="vocab-form">
          <div className="form-row">
            <div className="form-group">
              <label>ภาษาญี่ปุ่น *</label>
              <input
                value={form.japanese}
                onChange={(e) => set('japanese', e.target.value)}
                placeholder="例: 食べる"
                required
              />
            </div>
            <div className="form-group">
              <label>การอ่าน (ฮิรากานะ) *</label>
              <input
                value={form.reading}
                onChange={(e) => set('reading', e.target.value)}
                placeholder="例: たべる"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ภาษาไทย *</label>
              <input
                value={form.thai}
                onChange={(e) => set('thai', e.target.value)}
                placeholder="例: กิน"
                required
              />
            </div>
            <div className="form-group">
              <label>ระดับ JLPT</label>
              <select value={form.jlptLevel} onChange={(e) => set('jlptLevel', e.target.value)}>
                {JLPT_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>ชนิดคำ</label>
            <input
              value={form.partOfSpeech}
              onChange={(e) => set('partOfSpeech', e.target.value)}
              placeholder="例: กริยา, คำนาม, คำคุณศัพท์"
            />
          </div>
          <div className="form-section-label">ตัวอย่างประโยค (ไม่บังคับ)</div>
          <div className="form-row">
            <div className="form-group">
              <label>ตัวอย่างภาษาญี่ปุ่น</label>
              <input
                value={form.example.japanese}
                onChange={(e) => setExample('japanese', e.target.value)}
                placeholder="例: ご飯を食べる"
              />
            </div>
            <div className="form-group">
              <label>ตัวอย่างภาษาไทย</label>
              <input
                value={form.example.thai}
                onChange={(e) => setExample('thai', e.target.value)}
                placeholder="例: กินข้าว"
              />
            </div>
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
