import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RepoForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/submit-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (response.ok) {
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
