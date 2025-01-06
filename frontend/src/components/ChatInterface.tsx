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
    <div className="flex flex-col px-4 py-10 h-screen min-h-screen bg-gray-50 font-custom">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Chat with Your Codebase
      </h1>
      <Card className="h-screen shadow-lg max-w-2/3">
        <CardContent className="p-6">
          <div className="overflow-y-auto p-4 mb-4 space-y-4 h-96 bg-white rounded-lg border border-gray-200">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow-sm whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-blue-500 text-white self-end text-right"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the codebase..."
              className="flex-grow justify-center rounded-lg border-gray-300 shadow-sm"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white bg-gray-600 rounded-lg shadow transition hover:bg-blue-700"
            >
              {isLoading ? "Thinking..." : "Ask"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
