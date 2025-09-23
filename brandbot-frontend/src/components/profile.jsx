import React, { useState } from "react";
import Sidebar from "./sidebar";
import { User, Edit } from "lucide-react";

const user = {
  avatar: "",
  fullName: "Priya Sharma",
  role: "Pro Plan",
  dateJoined: "2024-01-15",
};

const Profile = () => {
  const [marketingSuggestions, setMarketingSuggestions] = useState(true);

  return (
    <div className="flex min-h-screen bg-white font-inter rounded-tl-2xl rounded-bl-2xl">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 bg-violet-950 rounded-tr-2xl rounded-br-2xl p-8 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-4xl text-violet-700">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {user.fullName}
              </div>
              <span className="bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {user.role}
              </span>
              <span className="text-violet-200 text-xs ml-2">
                Member since {user.dateJoined}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-violet-100 text-violet-950 font-semibold px-6 py-3 rounded-xl shadow transition border border-violet-200">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <hr className="border-t border-violet-800 mb-8" />

        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-8 shadow-md flex-1">
            <h2 className="text-xl font-semibold text-violet-950 mb-4">
              Preferences
            </h2>
            <div className="flex items-center gap-4">
              <span className="font-medium text-violet-900">
                Marketing Suggestions
              </span>
              <button
                className="ml-auto"
                onClick={() => setMarketingSuggestions((v) => !v)}
                aria-label="Toggle Marketing Suggestions"
              >
                {marketingSuggestions ? (
                  <span className="bg-teal-500 text-white px-3 py-1 rounded-full">
                    On
                  </span>
                ) : (
                  <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full">
                    Off
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
