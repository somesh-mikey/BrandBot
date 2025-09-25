import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";

const BUSINESS_ID = "xyz-dimensions-client-01"; // Use your business ID from backend

const Dashboard = () => {
  const [contentType, setContentType] = useState("");
  const [contentGoal, setContentGoal] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [audienceTargeted, setAudienceTargeted] = useState("");
  const [marketingSuggestions, setMarketingSuggestions] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const res = await fetch("https://brandbot.onrender.com/health");
        if (res.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("disconnected");
        }
      } catch (err) {
        setBackendStatus("disconnected");
      }
    };
    checkBackendConnection();
  }, []);

  const handleGenerate = async () => {
    // Validate required fields
    if (!contentType || !contentGoal) {
      alert("Please fill in both Content Type and Content Goal fields.");
      return;
    }

    setLoading(true);

    // Build prompt from form fields
    let prompt = `Content Type: ${contentType}\nContent Goal: ${contentGoal}`;
    if (media) {
      prompt += `\nMedia uploaded: ${media.name}`;
    }

    try {
      const res = await fetch("https://brandbot.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          business_id: BUSINESS_ID,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setGeneratedContent(data.generated_content || "No content generated.");
      setAudienceTargeted(data.rationale || "No audience analysis available.");
      setMarketingSuggestions(
        data.marketing_suggestions || "No marketing suggestions available."
      );
    } catch (err) {
      console.error("Error generating content:", err);
      setGeneratedContent(
        "Error generating content. Please check if the backend server is running on https://brandbot.onrender.com"
      );
      setAudienceTargeted("");
      setMarketingSuggestions("");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-inter rounded-tl-2xl rounded-bl-2xl">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-violet-950 rounded-tr-2xl rounded-br-2xl p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-5xl font-bold">Good Evening</h1>
            <div className="flex items-center mt-2">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  backendStatus === "connected"
                    ? "bg-green-400"
                    : backendStatus === "disconnected"
                    ? "bg-red-400"
                    : "bg-yellow-400"
                }`}
              ></div>
              <span className="text-violet-300 text-sm">
                Backend:{" "}
                {backendStatus === "connected"
                  ? "Connected"
                  : backendStatus === "disconnected"
                  ? "Disconnected"
                  : "Checking..."}
              </span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
            {/* Simple profile icon */}
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="12" r="8" fill="#D6CFF5" />
              <ellipse cx="18" cy="28" rx="12" ry="7" fill="#D6CFF5" />
              <circle cx="18" cy="12" r="5" fill="#210D5A" opacity="0.2" />
            </svg>
          </div>
        </div>
        <hr className="border-t border-violet-800 mb-8" />

        <div className="flex gap-8 flex-1">
          {/* Left Column */}
          <section className="flex-2 flex flex-col gap-6 w-2/3">
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Content Type
              </label>
              <select
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="">Select Media Type</option>
                <option>Social Post</option>
                <option>Email</option>
                <option>LinkedIn Post</option>
                <option>Blog</option>
                <option>SEO Article</option>
                <option>PR Article</option>
                <option>Deck</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Content Goal
              </label>
              <input
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                placeholder="Enter your prompt"
                value={contentGoal}
                onChange={(e) => setContentGoal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Upload Media
              </label>
              <input
                type="file"
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                onChange={(e) => setMedia(e.target.files[0])}
              />
            </div>
            <button
              className={`w-full py-5 rounded-xl font-bold text-xl mt-2 mb-2 ${
                backendStatus === "connected" && !loading
                  ? "bg-violet-100 text-violet-950 hover:bg-violet-200"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              onClick={handleGenerate}
              disabled={loading || backendStatus !== "connected"}
            >
              {loading
                ? "Generating..."
                : backendStatus === "connected"
                ? "Generate Content"
                : "Backend Disconnected"}
            </button>
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Marketing Suggestions
              </label>
              <div className="bg-white rounded-xl p-4 min-h-[120px] text-violet-950 text-lg">
                {marketingSuggestions}
              </div>
            </div>
          </section>

          {/* Right Column */}
          <section className="flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Generated Content
              </label>
              <div className="bg-white rounded-xl p-4 min-h-[180px] text-violet-950 text-lg">
                {generatedContent}
              </div>
            </div>
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Audience Targeted
              </label>
              <div className="bg-white rounded-xl p-4 min-h-[100px] text-violet-950 text-base">
                {audienceTargeted}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
