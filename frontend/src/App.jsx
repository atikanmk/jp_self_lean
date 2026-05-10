import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import FlashcardPage from './pages/FlashcardPage';
import VocabularyPage from './pages/VocabularyPage';
import ProgressPage from './pages/ProgressPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="app-header">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-jp">日本語</span>
              <span className="logo-text">JLPT Vocab</span>
            </div>
            <nav className="main-nav">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                🃏 ฝึกคำศัพท์
              </NavLink>
              <NavLink to="/vocabulary" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                📚 จัดการคำศัพท์
              </NavLink>
              <NavLink to="/progress" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                📊 ความคืบหน้า
              </NavLink>
            </nav>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<FlashcardPage />} />
            <Route path="/vocabulary" element={<VocabularyPage />} />
            <Route path="/progress" element={<ProgressPage />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>JLPT Vocabulary Flashcard App · ช่วยให้คุณเก่งภาษาญี่ปุ่น 🇯🇵</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
