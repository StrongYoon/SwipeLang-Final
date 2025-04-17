import React, { useEffect, useState } from "react";

const QuizMode = ({ knownSlangs, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizSet, setQuizSet] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // 슬랭 배열에서 퀴즈 5개 랜덤 선택
  useEffect(() => {
    const shuffled = [...knownSlangs].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 5);
    const quizzes = picked.map((slang) => {
      const choices = [slang.meaning];
      while (choices.length < 0) {
        const random = knownSlangs[Math.floor(Math.random() * knownSlangs.length)];
        if (!choices.includes(random.meaning)) {
          choices.push(random.meaning);
        }
      }
      return {
        phrase: slang.phrase,
        answer: slang.meaning,
        choices: choices.sort(() => 0.5 - Math.random()),
      };
    });
    setQuizSet(quizzes);
  }, [knownSlangs]);

  const handleAnswer = (choice) => {
    const currentQuiz = quizSet[currentIndex];
    setSelectedAnswer(choice);
    setIsCorrect(choice === currentQuiz.answer);
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  };

  if (quizSet.length === 0) return <p>퀴즈 로딩 중...</p>;
  if (currentIndex >= quizSet.length)
    return (
      <div>
        <h3>퀴즈 완료 🎉</h3>
        <button onClick={onExit}>돌아가기</button>
      </div>
    );

  const currentQuiz = quizSet[currentIndex];

  return (
    <div>
      <h3>🧠 퀴즈 {currentIndex + 1} / {quizSet.length}</h3>
      <p>
        <strong>{currentQuiz.phrase}</strong> 의 뜻은?
      </p>
      {currentQuiz.choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(choice)}
          disabled={selectedAnswer !== null}
          style={{
            margin: "6px",
            backgroundColor:
              selectedAnswer === choice
                ? isCorrect
                  ? "lightgreen"
                  : "salmon"
                : "",
          }}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default QuizMode;
