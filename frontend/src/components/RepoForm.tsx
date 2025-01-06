import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function RepoForm() {

 

  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const VITE_API_URL= import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${VITE_API_URL}/api/embed-codebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (response.status === 200) {
        console.log("success -> navigating to chat");

        const data = await response.json();
        console.log("data is ", data);
        // save the folder name in local storage

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
    <form onSubmit={handleSubmit} className="space-y-4 font-custom">
      <Input
        type="url"
        placeholder="https://github.com/username/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Analyze Repo"}
      </Button>
    </form>
  );
}
