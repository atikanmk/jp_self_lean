# 🇯🇵 JLPT Vocabulary Flashcard App

แอปพลิเคชันฝึกคำศัพท์ภาษาญี่ปุ่นสำหรับการสอบ JLPT ระดับ N5 ถึง N1 โดยใช้ระบบการ์ดแฟลช (Flashcard)

## ✨ ฟีเจอร์

- 🃏 **ระบบการ์ดแฟลช** — ฝึกคำศัพท์ด้วยการพลิกการ์ด
- 🔄 **2 โหมด** — ถามไทย→ญี่ปุ่น และ ญี่ปุ่น→ไทย
- 📚 **แบ่งระดับ JLPT** — N5, N4, N3, N2, N1
- ✏️ **จัดการคำศัพท์** — เพิ่ม แก้ไข ลบ
- 📊 **ติดตามความคืบหน้า** — บันทึกผลถูก/ผิด และความแม่นยำ
- 📱 **Responsive** — ใช้งานได้ทั้งมือถือและคอมพิวเตอร์

## 🛠️ เทคโนโลยี

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React.js (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Deploy Frontend | Vercel / GitHub Pages |
| Deploy Backend | Render / Railway |

## 🚀 การติดตั้งและรัน

### ความต้องการ
- Node.js >= 18
- MongoDB (local หรือ MongoDB Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # แก้ไข MONGODB_URI ให้ถูกต้อง
npm run dev
```

Server จะรันที่ `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # แก้ไข VITE_API_URL ถ้าจำเป็น
npm run dev
```

App จะเปิดที่ `http://localhost:5173`

## 📡 API Endpoints

### Vocabulary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vocabulary` | ดึงคำศัพท์ทั้งหมด (filter: `?level=N5&search=...`) |
| GET | `/api/vocabulary/:id` | ดึงคำศัพท์ตาม ID |
| POST | `/api/vocabulary` | เพิ่มคำศัพท์ใหม่ |
| PUT | `/api/vocabulary/:id` | แก้ไขคำศัพท์ |
| DELETE | `/api/vocabulary/:id` | ลบคำศัพท์ |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/:sessionId` | ดึงความคืบหน้าของ session |
| GET | `/api/progress/:sessionId/summary` | สรุปผลรวม |
| POST | `/api/progress` | บันทึกผลการตอบ |
| DELETE | `/api/progress/:sessionId` | ล้างความคืบหน้า |

## 📁 โครงสร้างโปรเจค

```
jp_self_lean/
├── frontend/                # React + Vite
│   └── src/
│       ├── api/             # Axios API calls
│       ├── components/      # Flashcard, LevelSelector, ModeSelector, VocabForm
│       ├── pages/           # FlashcardPage, VocabularyPage, ProgressPage
│       └── utils/           # Session ID, constants, helpers
├── backend/                 # Node.js + Express
│   ├── data/seed.js         # ข้อมูลเริ่มต้น
│   ├── models/              # Vocabulary, Progress (Mongoose)
│   ├── routes/              # vocabulary, progress
│   └── server.js
└── README.md
```

## 🌐 Deployment

### Frontend → Vercel
1. เชื่อม repo กับ Vercel
2. ตั้งค่า Root Directory: `frontend`
3. ตั้ง Environment Variable: `VITE_API_URL=https://your-backend.render.com/api`

### Backend → Render
1. สร้าง Web Service ใหม่
2. Root Directory: `backend`
3. Start Command: `npm start`
4. ตั้ง Environment Variables: `MONGODB_URI`, `PORT`
