// components/ReviewMode.jsx
import React, { useState } from "react";

const ReviewMode = ({ reviewSlangs, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  if (reviewSlangs.length === 0) {
    return (
      <div>
        <h3>복습할 표현이 없습니다 🙌</h3>
        <button onClick={onExit}>돌아가기</button>
      </div>
    );
  }

  const currentSlang = reviewSlangs[currentIndex];

  const handleNext = () => {
    setShowMeaning(false);
    if (currentIndex < reviewSlangs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("복습 완료! 🎉");
      onExit();
    }
  };

  return (
    <div>
      <h3>🔁 복습 {currentIndex + 1} / {reviewSlangs.length}</h3>
      <p><strong>{currentSlang.phrase}</strong></p>
      {showMeaning ? (
        <div>
          <p>📖 {currentSlang.meaning}</p>
          {currentSlang.example && <p>💬 예문: {currentSlang.example}</p>}
          <button onClick={handleNext}>다음</button>
        </div>
      ) : (
        <button onClick={() => setShowMeaning(true)}>해석 보기</button>
      )}
    </div>
  );
};

export default ReviewMode;
