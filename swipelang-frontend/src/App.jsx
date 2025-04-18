// src/App.jsx
import React, { useEffect, useState } from 'react';
import SwipeCard from './components/SwipeCard';
import QuizMode from './components/QuizMode';
import ReviewMode from './components/ReviewMode';
import StatsPanel from './components/StatsPanel';
import UserNickname from './components/UserNickname';
import DownloadButton from './components/DownloadButton';
import LevelBadge from './components/LevelBadge';
import PetStatus from './components/PetStatus';
import axios from 'axios';

const App = () => {
  const [slangs, setSlangs] = useState([]);
  const [knownSlangs, setKnownSlangs] = useState([]);
  const [reviewSlangs, setReviewSlangs] = useState([]);
  const [quizMode, setQuizMode] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [loading, setLoading] = useState(true);

  // 다음 카드 불러오기
  const fetchNextSlang = () => {
    axios
      .get('https://swipelang-server4.onrender.com/slang/today')
      .then(res => setSlangs(prev => [...prev.slice(1), res.data]))
      .catch(err => console.error('슬랭 추가 불러오기 실패:', err));
  };

  // 통계 불러오기
  const fetchStats = async () => {
    try {
      const res = await axios.get(`https://swipelang-server4.onrender.com/stats?nickname=${nickname}`);
      setKnownSlangs(res.data.known || []);
      setReviewSlangs(res.data.review || []);
    } catch (err) {
      console.error('📛 학습 기록 불러오기 실패:', err);
    }
  };

  // 초기 묶음 불러오기
  const fetchInitialSlangs = async () => {
    try {
      const responses = await Promise.all(
        Array.from({ length: 5 }, () =>
          axios.get('https://swipelang-server4.onrender.com/slang/today')
        )
      );
      setSlangs(responses.map(r => r.data));
    } catch (err) {
      console.error('📛 초기 슬랭 묶음 불러오기 실패:', err);
    }
  };

  // 마운트 및 nickname 변경 시 초기화
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchInitialSlangs();
      await fetchStats();
      setLoading(false);
    })();
  }, [nickname]);

  // 스와이프 핸들러
  const handleSwipe = (direction, phrase) => {
    const url = direction === 'right' ? '/slang/remember' : '/slang/repeat';
    axios
      .post(`https://swipelang-server4.onrender.com${url}`, { phrase, nickname })
      .then(async () => {
        await fetchStats();
        fetchNextSlang();
      })
      .catch(err => console.error('스와이프 처리 실패:', err));
  };

  if (!nickname) {
    return <UserNickname onSave={setNickname} />;
  }

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#f0faf7',
        minHeight: '100vh',
        padding: '30px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <h1 style={{ fontSize: '2.2rem', marginBottom: '3px' }}>📚 SwipeLang</h1>
      <LevelBadge knowncount={knownSlangs.length} />
      <StatsPanel knowncount={knownSlangs.length} review={reviewSlangs.length} />

      {quizMode ? (
        <QuizMode
          knownSlangs={knownSlangs}
          onExit={() => {
            setQuizMode(false);
            fetchInitialSlangs();
          }}
        />
      ) : reviewMode ? (
        <ReviewMode reviewSlangs={reviewSlangs} onExit={() => setReviewMode(false)} />
      ) : (
        <div>
          {loading ? (
            <p style={{ fontSize: '1.2rem', color: '#888' }}>⏳ 슬랭 불러오는 중...</p>
          ) : (
            slangs[0] && (
              <SwipeCard slang={slangs[0]} onSwipe={handleSwipe} onSwiped={fetchNextSlang} />
            )
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setQuizMode(true)} style={{ marginRight: '10px' }}
            >
              🧠 퀴즈 모드
            </button>
            <button onClick={() => setReviewMode(true)} style={{ marginRight: '10px' }}>
              🔁 복습 모드
            </button>
          </div>
        </div>
      )}

      <DownloadButton knownSlangs={knownSlangs} reviewSlangs={reviewSlangs} />
    </div>
  );
}; // ← 여기서 App 함수 완전 종료

export default App;  // ← 최상단 레벨에서만 export!
