import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import apiService from "../services/api";

const BUSINESS_ID = "xyz-dimensions-client-01"; // Use your business ID from backend

const Dashboard = () => {
  const [contentType, setContentType] = useState("");
  const [contentGoal, setContentGoal] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [availableClients, setAvailableClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Check backend connection and load clients on component mount
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

    // Load available clients
    loadAvailableClients();
  }, []);

  const loadAvailableClients = async () => {
    setLoadingClients(true);
    try {
      const clients = await apiService.getAllClientsForSelection();
      setAvailableClients(clients);
      // Auto-select first client if available
      if (clients.length > 0 && !selectedClientId) {
        setSelectedClientId(clients[0].id);
      }
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleGenerate = async () => {
    // Validate required fields
    if (!contentGoal) {
      alert("Please fill in the Content Goal field.");
      return;
    }

    // Check if it's a question/analysis request
    const isQuestion = contentType === "Question/Analysis" ||
      /^(what|who|when|where|why|how|analyze|tell me|explain|describe|summarize|list|identify)/i.test(contentGoal.trim()) ||
      contentGoal.trim().endsWith('?');

    // Content Type is optional for questions, required for content generation
    if (!isQuestion && !contentType) {
      alert("Please select a Content Type or ask a question.");
      return;
    }

    if (!selectedClientId) {
      alert("Please select a client profile.");
      return;
    }

    setLoading(true);

    // Read media file content if uploaded
    let mediaContent = null;
    if (media) {
      try {
        const fileType = media.type || "";

        if (fileType.startsWith("text/") || media.name.endsWith(".txt") || media.name.endsWith(".md") ||
          media.name.endsWith(".doc") || media.name.endsWith(".docx") || media.name.toLowerCase().includes("resume")) {
          // Read as text for text files
          mediaContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(media);
          });
        } else if (fileType.startsWith("image/")) {
          // For images, read as base64 and describe
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(media);
          });
          mediaContent = `[Image file: ${media.name}]`;
        } else {
          // For other file types, just mention the file
          mediaContent = `[File: ${media.name} (${(media.size / 1024).toFixed(2)} KB)]`;
        }
      } catch (err) {
        console.error("Error reading media file:", err);
        alert("Error reading media file. Proceeding without it.");
      }
    }

    // Build prompt based on whether it's a question/analysis or content generation
    let prompt;
    if (isQuestion && mediaContent) {
      // For questions with uploaded files, prioritize analysis
      prompt = `User Question: ${contentGoal}\n\n`;
      prompt += `Please analyze the following document and answer the user's question directly and concisely:\n\n`;
      prompt += `Document Content (${media.name}):\n${mediaContent}\n\n`;
      prompt += `Content Type context: ${contentType || "General"}\n\n`;
      prompt += `Provide a clear, direct answer to the question based on the document analysis.`;
    } else if (mediaContent) {
      // For content generation with media
      prompt = `Content Type: ${contentType}\nContent Goal: ${contentGoal}\n\n`;
      prompt += `Uploaded Media File (${media.name}):\n${mediaContent}`;
    } else {
      // Standard content generation without media
      prompt = `Content Type: ${contentType}\nContent Goal: ${contentGoal}`;
    }

    try {
      // Use client_id if selected, otherwise fall back to business_id
      const data = await apiService.generateContent(
        prompt,
        selectedClientId ? null : BUSINESS_ID,
        selectedClientId
      );

      setGeneratedContent(data.generated_content || "No content generated.");

      // Save prompt to history
      const promptText = contentGoal.trim();
      if (promptText) {
        const historyKey = "contentHistory";
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const historyEntry = {
          prompt: promptText,
          contentType: contentType || "Question/Analysis",
          timestamp: new Date().toISOString(),
          generatedContent: data.generated_content || ""
        };
        // Add to beginning of array and keep only last 50 entries
        existingHistory.unshift(historyEntry);
        const limitedHistory = existingHistory.slice(0, 50);
        localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
      }
    } catch (err) {
      console.error("Error generating content:", err);
      setGeneratedContent(
        `Error generating content: ${err.message}. Please check if the backend server is running.`
      );
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
                className={`w-3 h-3 rounded-full mr-2 ${backendStatus === "connected"
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
          {/* Main Column */}
          <section className="flex flex-col gap-6 w-full">
            <div>
              <label className="block text-white text-lg font-medium mb-2 text-left">
                Select Client Profile
              </label>
              <select
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                value={selectedClientId || ""}
                onChange={(e) => setSelectedClientId(e.target.value ? parseInt(e.target.value) : null)}
                disabled={loadingClients}
              >
                <option value="">-- Select Client --</option>
                {availableClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company_name} ({client.plan_type})
                  </option>
                ))}
              </select>
              {loadingClients && (
                <p className="text-violet-300 text-sm mt-1">Loading clients...</p>
              )}
            </div>
            <div>
              <label className="block text-white text-lg font-medium mb-2 text-left">
                Content Type
              </label>
              <select
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="">Select Media Type (Optional for Questions)</option>
                <option>Question/Analysis</option>
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
              <label className="block text-white text-lg font-medium mb-2 text-left">
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
              <label className="block text-white text-lg font-medium mb-2 text-left">
                Upload Media
              </label>
              <input
                type="file"
                className="w-full p-4 rounded-xl text-violet-950 bg-white text-lg outline-none"
                onChange={(e) => setMedia(e.target.files[0])}
              />
            </div>
            <button
              className={`w-full py-5 rounded-xl font-bold text-xl mt-2 mb-2 ${backendStatus === "connected" && !loading && selectedClientId
                ? "bg-violet-100 text-violet-950 hover:bg-violet-200"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              onClick={handleGenerate}
              disabled={loading || backendStatus !== "connected" || !selectedClientId}
            >
              {loading
                ? "Generating..."
                : backendStatus === "connected"
                  ? "Generate Content"
                  : "Backend Disconnected"}
            </button>
            <div>
              <label className="block text-white text-lg font-medium mb-2 text-left">
                Generated Content
              </label>
              <div className="bg-white rounded-xl p-4 min-h-[400px] text-violet-950 text-lg">
                {generatedContent}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
