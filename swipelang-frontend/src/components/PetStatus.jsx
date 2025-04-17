// src/components/PetStatus.jsx
import React, { useEffect, useState } from 'react';

const PetStatus = ({ knownCount }) => {
  const [daysInactive, setDaysInactive] = useState(0);

  // 마지막 접속일 확인
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastVisit = localStorage.getItem('lastVisit');

    if (lastVisit) {
      const diffTime = new Date(today) - new Date(lastVisit);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysInactive(diffDays);
    } else {
      setDaysInactive(0);
    }

    // 오늘 접속일 저장
    localStorage.setItem('lastVisit', today);
  }, []);

  // 성장 단계 (1~10)
  const getStage = (count) => {
    if (count >= 2700) return 10;
    if (count >= 2400) return 9;
    if (count >= 2100) return 8;
    if (count >= 1800) return 7;
    if (count >= 1500) return 6;
    if (count >= 1200) return 5;
    if (count >= 900) return 4;
    if (count >= 600) return 3;
    if (count >= 300) return 2;
    return 1;
  };

  const stage = getStage(knownCount);

  // 이미지 경로 결정
  let petImage = `/images/pet/pet_stage${stage}.png`;
  let message = '🐶 오늘도 함께 공부해요!';

  if (daysInactive >= 10) {
    petImage = '/images/pet/pet_sick.png';
    message = '🤒 나 너무 아파요... 10일째 못 봤어요...';
  } else if (daysInactive >= 7) {
    petImage = '/images/pet/pet_sick.png';
    message = '😷 오빠... 감기 걸렸어요...';
  } else if (daysInactive >= 3) {
    petImage = '/images/pet/pet_sad.png';
    message = '🥺 나 너무 보고 싶었어...';
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <img
        src={petImage}
        alt={`펫 상태 ${stage}`}
        style={{ width: '120px', height: '120px' }}
      />
      <p style={{ fontSize: '0.95rem', color: '#555' }}>{message}</p>
    </div>
  );
};

export default PetStatus;
