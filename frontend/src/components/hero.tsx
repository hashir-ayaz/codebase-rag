"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export default function Hero() {
  const [githubUrl, setGithubUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement GitHub repo processing logic
    console.log("Processing GitHub repo:", githubUrl);
  };

  return (
    <section className="px-4 py-20 text-center">
      <h1 className="mb-6 text-5xl font-bold">CODEBASE RAG</h1>
      <p className="max-w-2xl mx-auto mb-8 text-xl">
        Upload your GitHub repo and get instant, AI-powered insights into your
        codebase.
      </p>

      <Link to="/home" className="mr-4">
        <Button>
          <Github className="w-4 h-4 mr-2" />
          Analyze
        </Button>
      </Link>
    </section>
  );
}
