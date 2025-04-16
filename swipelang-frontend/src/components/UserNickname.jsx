// src/components/UserNickname.jsx
import React, { useState } from 'react';
import './UserNickname.css';

const UserNickname = ({ onSave }) => {
  const [nickname, setNickname] = useState('');

  const handleSave = () => {
    if (nickname.trim() === '') return;
    localStorage.setItem('nickname', nickname);
    onSave(nickname);
  };

  return (
    <div className="nickname-container">
      <div className="nickname-card">
        <h2>🙋‍♂️ 사용자 닉네임</h2>
        <p>닉네임을 입력하세요</p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ex) 동현오빠"
        />
        <button onClick={handleSave}>💾 저장</button>
      </div>
    </div>
  );
};

export default UserNickname;
