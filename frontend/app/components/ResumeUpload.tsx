"use client";

import { useState } from "react";

interface ResumeUploadProps {
  onUploadSuccess: (text: string, metadata: any) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      const response = await fetch("http://localhost:8000/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadSuccess(data.text, data.metadata);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">Upload your Resume</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">PDF format preferred. Our agent will extract your skills and background.</p>
      </div>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="resume-upload"
      />
      <label
        htmlFor="resume-upload"
        className={`px-6 py-2 rounded-full cursor-pointer transition-colors ${
          uploading 
            ? "bg-zinc-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {uploading ? "Parsing..." : "Select File"}
      </label>
    </div>
  );
}
