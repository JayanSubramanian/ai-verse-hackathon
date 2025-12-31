"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [outcome, setOutcome] = useState("Rejected");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { job_title: jobTitle, company: "Unknown", outcome, feedback_text: feedback, user_id: 1 };
    
    try {
      await fetch("http://localhost:8000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
        Feedback submitted! The agent will use this to refine your roadmap.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold">Log Application Outcome</h3>
      <p className="text-sm text-zinc-500">Help your agent learn from your real-world experiences.</p>
      
      <div>
        <label className="block text-xs font-medium uppercase text-zinc-500 mb-1">Job Title</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full p-2 rounded border dark:bg-black dark:border-zinc-700"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase text-zinc-500 mb-1">Outcome</label>
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="w-full p-2 rounded border dark:bg-black dark:border-zinc-700"
        >
          <option value="Rejected">Rejected</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase text-zinc-500 mb-1">What was the feedback? (if any)</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 rounded border dark:bg-black dark:border-zinc-700 h-20"
        />
      </div>

      <button type="submit" className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2 rounded-lg font-medium">
        Submit Outcome
      </button>
    </form>
  );
}
