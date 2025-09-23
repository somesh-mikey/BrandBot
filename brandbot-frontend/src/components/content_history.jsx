import React from "react";
import Sidebar from "./sidebar";

const promptHistory = [
  "Generate a Facebook ad for summer sale",
  "Instagram post for product launch",
  "Write a tweet about eco-friendly packaging",
  "Create a LinkedIn update for company milestone",
  "Suggest a YouTube video title for unboxing",
];

const ContentHistory = () => {
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
            <ul className="space-y-4">
              {promptHistory.map((prompt, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="block text-lg text-violet-900 hover:text-violet-700 hover:underline transition-colors bg-violet-50 rounded-lg px-4 py-3"
                  >
                    {prompt}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContentHistory;
