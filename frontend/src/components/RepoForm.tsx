import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RepoForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${VITE_API_URL}/embed-codebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("folderName", data.folderName);
        navigate("/chat");
      } else {
        console.error("Failed to submit repo");
        alert("Failed to submit repo");
      }
    } catch (error) {
      console.error("Error submitting repo:", error);
      alert("Error submitting repo");
    }

    setIsLoading(false);
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <motion.h2
          className="mb-8 text-4xl font-extrabold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Submit Your Repository
        </motion.h2>
        <motion.p
          className="mb-8 text-lg text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Enter your GitHub repository URL to analyze and gain AI-powered
          insights.
        </motion.p>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Input
            type="url"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
            className="w-full"
          />
          <Button
            type="submit"
            className="w-full text-white bg-gradient-to-r from-accent to-pinkishGlow py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-[0_0_30px_rgba(244,114,182,0.7)] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Analyze"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
