// components/AddSlangForm.jsx
import React, { useState } from "react";

const AddSlangForm = ({ onAdd }) => {
  const [phrase, setPhrase] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phrase || !meaning) {
      alert("표현과 의미는 필수입니다.");
      return;
    }

    const newSlang = { phrase, meaning, example };
    onAdd(newSlang);
    setPhrase("");
    setMeaning("");
    setExample("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>🧠 슬랭 직접 추가</h3>
      <input
        type="text"
        placeholder="표현"
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="의미"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="예문 (선택)"
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />
      <button type="submit">추가하기</button>
    </form>
  );
};

export default AddSlangForm;
