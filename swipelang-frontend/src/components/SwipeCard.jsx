// src/components/SwipeCard.jsx

import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import './SwipeCard.css';

const SwipeCard = ({ slang, onSwipe, onSwiped }) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    setSwiped(false);
    setDirection(null);
    setShowMeaning(false);
  }, [slang]);

  const handleTTS = () => {
    const audio = new Audio(`https://swipelang-server4.onrender.com/tts?phrase=${encodeURIComponent(slang.phrase)}`);
    audio.play();
  };

  const handleSwipe = (dir) => {
    if (swiped) return;
    setSwiped(true);
    setDirection(dir);
    onSwipe(dir, slang.phrase);
    if (onSwiped) onSwiped();
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
            exit={{ x: direction === 'left' ? -200 : 200, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="slang-phrase">💬 {slang.phrase}</h2>

            <div className="btn-row">
              <button className="action-btn" onClick={handleTTS}>🔊 발음 듣기</button>
              <button className="action-btn" onClick={() => setShowMeaning(!showMeaning)}>
                📖 해석 보기
              </button>
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
    </div>
  );
};

export default SwipeCard;
