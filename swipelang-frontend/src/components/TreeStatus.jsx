// src/components/TreeStatus.jsx
import React from 'react';
import Lottie from 'lottie-react';
import stage1 from '../lottie/tree_stage1.json';
import stage2 from '../lottie/tree_stage2.json';
import stage3 from '../lottie/tree_stage3.json';

const TreeStatus = ({ count }) => {
  let animation = stage1;

  if (count >= 30) {
    animation = stage3;
  } else if (count >= 10) {
    animation = stage2;
  }

  return (
    <div style={{ maxWidth: 200, margin: '0 auto' }}>
      <Lottie animationData={animation} loop={true} />
    </div>
  );
};

export default TreeStatus;
