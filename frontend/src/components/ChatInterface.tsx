import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const folderName = localStorage.getItem("folderName");
    if (folderName === null) {
      console.error("folderName is null");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input, folderName }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        console.error("Failed to get answer");
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1>Chat with the codebase</h1>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="overflow-y-auto my-2 mb-4 space-y-4 h-96 whitespace-pre-wrap">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-black text-white text-right"
                    : "bg-gray-100 "
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the codebase..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Thinking..." : "Ask"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
