// src/components/QuizPanel.jsx
import React from 'react';

const QuizPanel = ({ quiz, onAnswer }) => {
  if (!quiz) return null;

  return (
    <div className="quiz-panel">
      <h2>🧠 퀴즈 모드</h2>
      <p><strong>{quiz.question}</strong> 의 의미는?</p>
      {quiz.choices.map((choice, i) => (
        <button key={i} onClick={() => onAnswer(choice)}>
          {choice}
        </button>
      ))}
    </div>
  );
};

export default QuizPanel;
