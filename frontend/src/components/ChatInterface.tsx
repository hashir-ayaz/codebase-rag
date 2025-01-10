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

    const VITE_API_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${VITE_API_URL}/api/query`, {
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
    <div className="flex flex-col items-center justify-center h-screen min-h-screen px-4 py-10 bg-gray-50 font-custom">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Chat with Your Codebase
      </h1>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-6">
          <div className="p-4 mb-4 space-y-4 overflow-y-auto bg-white border border-gray-200 rounded-lg h-96">
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
              className="justify-center flex-grow border-gray-300 rounded-lg shadow-sm"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white transition bg-gray-600 rounded-lg shadow hover:bg-blue-700"
            >
              {isLoading ? "Thinking..." : "Ask"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
