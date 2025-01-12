"use client";

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
      }
    } catch (error) {
      console.error("Error submitting repo:", error);
    }

    setIsLoading(false);
  };

  return (
    <section className="px-4 py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-lg text-center">
        <motion.h2
          className="mb-8 text-4xl font-extrabold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Submit Your <span className="text-blue-600">Repository</span>
        </motion.h2>
        <motion.p
          className="mb-8 text-lg text-gray-600"
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
            className="w-full text-white bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Analyze Repo"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
