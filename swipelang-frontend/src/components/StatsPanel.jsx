// components/StatsPanel.jsx
import React from "react";

const StatsPanel = ({ knownCount, reviewCount, level }) => {
  const getBadge = (count) => {
    if (count >= 100) return "🏆 슬랭 달인";
    if (count >= 50) return "🥇 슬랭 고수";
    if (count >= 20) return "🥈 슬랭 중수";
    if (count >= 5) return "🥉 슬랭 초보";
    return "🍼 시작 단계";
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>
      <h3>📊 오늘의 학습 요약</h3>
      <p>✅ 외운 표현: <strong>{knownCount}</strong>개</p>
      <p>🔁 복습할 표현: <strong>{reviewCount}</strong>개</p>
      <p>🏅 현재 레벨: <strong>{getBadge(level)}</strong> (Lv. {level})</p>
    </div>
  );
};

export default StatsPanel;
