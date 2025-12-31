"use client";

import { useState } from "react";

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    current_role: "",
    experience_level: "Student",
    skills: "",
    interests: "",
    career_goals: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert comma-separated strings to lists
    const submittedData = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()).filter((s) => s),
      interests: formData.interests
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    };
    onSubmit(submittedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Your Career Profile
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Current Role
            </label>
            <input
              type="text"
              name="current_role"
              value={formData.current_role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Student / Junior Dev"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Experience Level
          </label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Student">Student</option>
            <option value="Entry-level">Entry-level (0-2 years)</option>
            <option value="Mid-level">Mid-level (3-5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
            placeholder="Python, React, Data Analysis..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Interests (comma separated)
          </label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
            placeholder="AI, Web Development, Climate Tech..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Career Goal
          </label>
          <input
            required
            type="text"
            name="career_goals"
            value={formData.career_goals}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
            placeholder="Become a Machine Learning Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Bio / Resume Summary
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
            placeholder="Briefly describe your background..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Generate Career Plan"}
        </button>
      </div>
    </form>
  );
}
