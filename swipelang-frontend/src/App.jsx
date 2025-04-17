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

  console.log("🟢 App 시작됨");
  console.log("🟢 nickname:", nickname);
  console.log("🟢 slangs:", slangs);

  const fetchNextSlang = () => {
    axios
      .get('https://swipelang-server4.onrender.com/slang/today')
      .then((res) => {
        setSlangs(prev => [...prev.slice(1), res.data]);  // 🔧 스프레드 오타 수정됨!
      })
      .catch((err) => console.error('슬랭 추가 불러오기 실패:', err));
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`https://swipelang-server4.onrender.com/stats?nickname=${nickname}`);
      setKnownSlangs(res.data.known || []);
      setReviewSlangs(res.data.review || []);
    } catch (err) {
      console.error('📛 학습 기록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔧 Promise.all + Array.from 구조 확실히 수정
        const slangResponses = await Promise.all(
          Array.from({ length: 5 }, () =>
            axios.get('https://swipelang-server4.onrender.com/slang/today')
          )
        );
        setSlangs(slangResponses.map(res => res.data));

        await fetchStats();  // 🔄 fetchStats도 분리해서 사용

      } catch (error) {
        console.error("📛 초기 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nickname]);

  const handleSwipe = (direction, phrase) => {
    console.log(`👉 ${direction} swipe on "${phrase}"`);
    const url = direction === 'right' ? '/slang/remember' : '/slang/repeat';

    axios
      .post(`https://swipelang-server4.onrender.com${url}`, { phrase, nickname })
      .then(() => {
        console.log(`${direction === 'right' ? '기억 완료' : '복습 등록'}됨`);
        fetchStats();
        fetchNextSlang();  // 🔄 다음 카드 자동 로드
      })
      .catch((err) => console.error('스와이프 처리 실패:', err));
  };

  if (!nickname) {
    return <UserNickname onSave={setNickname} />;
  }

  return (
    <div className="App" style={{
      backgroundColor: '#f0faf7',
      minHeight: '100vh',
      padding: '30px',
      textAlign: 'center',
      maxWidth: '600px',       // 👈 최대 너비 제한 (1/3 정도)
      margin: '0 auto'
    }}>
      <h1 style={{fontSize: '2.2rem', marginBottom: '5px'}}>📚 SwipeLang</h1>
      <PetStatus knowncount={knownSlangs.length} />
      <LevelBadge knowncount={knownSlangs.length} />
      <StatsPanel knowncount={knownSlangs.length} review={reviewSlangs.length} />

      {quizMode ? (
        <QuizMode knownSlangs={knownSlangs} onExit={() => setQuizMode(false)} />
      ) : reviewMode ? (
        <ReviewMode reviewSlangs={reviewSlangs} onExit={() => setReviewMode(false)} />
      ) : (
        <div>
          {loading ? (
            <p style={{ fontSize: '1.2rem', color: '#888' }}>⏳ 슬랭 불러오는 중...</p>
          ) : (
            slangs.length > 0 && (
              <SwipeCard
                slang={slangs[0]}
                onSwipe={handleSwipe}
                onSwiped={fetchNextSlang}
              />
            )
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setQuizMode(true)} style={{ marginRight: '10px' }}>
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
};

export default App;
