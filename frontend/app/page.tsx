"use client";

import { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import RoadmapDisplay from "./components/RoadmapDisplay";
import ResumeUpload from "./components/ResumeUpload";
import FeedbackForm from "./components/FeedbackForm";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeData, setResumeData] = useState<any>(null);

  const handleProfileSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, bio: resumeData?.text || data.bio }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze profile");
      }

      const resultData = await response.json();
      setResult(resultData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = (text: string, metadata: any) => {
    setResumeData({ text, metadata });
    // In a real app, you'd auto-fill the form here
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold tracking-tight">
          CareerCompass<span className="text-blue-600">AI</span>
        </h1>
        <div className="flex gap-4">
           <button className="text-sm font-medium opacity-70 hover:opacity-100">Dashboard</button>
           <button className="text-sm font-medium opacity-70 hover:opacity-100">Jobs</button>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 flex flex-col gap-8">
           <section>
              <h2 className="text-xl font-semibold mb-4">1. Identify</h2>
              <ResumeUpload onUploadSuccess={handleResumeUpload} />
              {resumeData && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                   ✓ Resume parsed successfully
                </div>
              )}
           </section>

           <section>
              <h2 className="text-xl font-semibold mb-4">2. Track & Adapt</h2>
              <FeedbackForm />
           </section>
        </div>

        <div className="lg:col-span-8">
          {!result ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/30 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
               <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
               <ProfileForm onSubmit={handleProfileSubmit} isLoading={loading} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Career Roadmap</h2>
                  <button 
                    onClick={() => setResult(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit Profile
                  </button>
               </div>
               <RoadmapDisplay data={result} />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
