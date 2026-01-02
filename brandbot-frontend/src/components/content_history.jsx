import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";

const ContentHistory = () => {
  const [promptHistory, setPromptHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const historyKey = "contentHistory";
    const storedHistory = localStorage.getItem(historyKey);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setPromptHistory(parsedHistory);
      } catch (err) {
        console.error("Error parsing content history:", err);
        setPromptHistory([]);
      }
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-white font-inter rounded-tl-2xl rounded-bl-2xl">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-violet-950 rounded-tr-2xl rounded-br-2xl p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-5xl font-bold">Content History</h1>
          <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="12" r="8" fill="#D6CFF5" />
              <ellipse cx="18" cy="28" rx="12" ry="7" fill="#D6CFF5" />
              <circle cx="18" cy="12" r="5" fill="#210D5A" opacity="0.2" />
            </svg>
          </div>
        </div>
        <hr className="border-t border-violet-800 mb-8" />

        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-8 shadow-md flex-1">
            <h2 className="text-2xl font-semibold text-violet-950 mb-6">
              Your Prompt History
            </h2>
            {promptHistory.length === 0 ? (
              <p className="text-violet-700 text-lg">No content history yet. Generate some content to see it here!</p>
            ) : (
              <ul className="space-y-4">
                {promptHistory.map((entry, idx) => (
                  <li key={idx}>
                    <div className="block text-lg text-violet-900 bg-violet-50 rounded-lg px-4 py-3 hover:bg-violet-100 transition-colors">
                      <div className="font-medium mb-1">{entry.prompt}</div>
                      <div className="text-sm text-violet-600 flex items-center gap-4 mt-2">
                        <span>Type: {entry.contentType}</span>
                        <span>•</span>
                        <span>{formatDate(entry.timestamp)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentHistory;
