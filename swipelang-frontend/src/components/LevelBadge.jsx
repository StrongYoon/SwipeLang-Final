// components/LevelBadge.jsx
import React from "react";

// 간단한 레벨 로직: 외운 개수 기준
const getLevelInfo = (count) => {
  if (count >= 100) return { level: "🥇 Master", color: "#ffcc00" };
  if (count >= 50) return { level: "🔥 Expert", color: "#ff6600" };
  if (count >= 30) return { level: "🚀 Advanced", color: "#3399ff" };
  if (count >= 10) return { level: "🔰 Beginner", color: "#66cc66" };
  return { level: "🌱 Newbie", color: "#cccccc" };
};

const LevelBadge = ({ knownCount }) => {
  const { level, color } = getLevelInfo(knownCount);

  return (
    <div style={{
      backgroundColor: color,
      padding: "10px 20px",
      borderRadius: "20px",
      fontWeight: "bold",
      display: "inline-block",
      color: "#fff",
      marginBottom: "10px"
    }}>
      {level} ({knownCount}개 외움)
    </div>
  );
};

export default LevelBadge;
