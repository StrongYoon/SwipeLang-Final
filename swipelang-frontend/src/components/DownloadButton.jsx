import React from "react";
import { saveAs } from "file-saver";

const DownloadButton = ({ slangs, nickname }) => {
  const handleDownload = () => {
    const headers = ["phrase", "meaning", "example"];
    const rows = slangs.map((s) => [
      `"${s.phrase}"`,
      `"${s.meaning}"`,
      `"${s.example || ""}"`,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const filename = nickname ? `${nickname}_slang_export.csv` : "slang_export.csv";
    saveAs(blob, filename);
  };

  return (
    <button onClick={handleDownload} style={{ marginTop: "10px" }}>
      📤 내 단어장 다운로드
    </button>
  );
};

export default DownloadButton;
