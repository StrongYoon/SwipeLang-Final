import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './SwipeCard.css';

const SwipeCard = ({ slang, onSwipe, onSwiped }) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [direction, setDirection] = useState(null);
  const [feedback, setFeedback] = useState('');

  const rememberedTexts = ['완벽하게 외움!', '이건 쉽지~', '기억력 만렙!', '나 이거 알아!'];
  const reviewTexts = ['음… 다시 볼까?', '기억이 가물가물!', '이건 좀 헷갈렸지!', '복습하자!'];

  useEffect(() => {
    setSwiped(false);
    setDirection(null);
    setShowMeaning(false);
    setFeedback('');
  }, [slang]);

  const handleTTS = () => {
    const audio = new Audio(`https://swipelang-server4.onrender.com/tts?phrase=${encodeURIComponent(slang.phrase)}`);
    audio.play();
  };

  const handleSwipe = (dir) => {
    if (swiped) return;
    setSwiped(true);
    setDirection(dir);

    // 피드백 문구 랜덤 설정
    const texts = dir === 'right' ? rememberedTexts : reviewTexts;
    const randomMsg = texts[Math.floor(Math.random() * texts.length)];
    setFeedback(randomMsg);

    onSwipe(dir, slang.phrase);
    if (onSwiped) onSwiped();

    // 피드백 1.2초 후 사라짐
    setTimeout(() => setFeedback(''), 2000);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div {...handlers} className="swipe-wrapper">
      <AnimatePresence>
        {!swiped && (
          <motion.div
            className="card"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === 'left' ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="slang-phrase">💬 {slang.phrase}</h2>

            <div className="btn-row">
              <button className="action-btn" onClick={handleTTS}>🔊 발음 듣기</button>
              <button className="action-btn" onClick={() => setShowMeaning(!showMeaning)}>📖 해석 보기</button>
            </div>

            {showMeaning && (
              <div className="meaning">
                <p><strong>뜻:</strong> {slang.meaning}</p>
                {slang.example && <p><strong>예문:</strong> {slang.example}</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.p
            key="feedback"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '1.2rem', color: '#4caf50', marginTop: '10px' }}
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipeCard;
