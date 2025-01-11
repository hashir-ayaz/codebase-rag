"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

    // Add skeleton loading message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "..." }, // Placeholder for the loading dots
    ]);

    const folderName = localStorage.getItem("folderName");
    if (!folderName) {
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
        setMessages((prev) => {
          // Remove the skeleton message before adding the real response
          const updatedMessages = [...prev];
          updatedMessages.pop(); // Remove the last skeleton message
          return [...updatedMessages, assistantMessage];
        });
      } else {
        console.error("Failed to get answer");
      }
    } catch (error) {
      console.error("Error asking question:", error);
    }

    setIsLoading(false);
  };

  return (
    <section className="px-4 py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl">
        <motion.h1
          className="mb-8 text-4xl font-extrabold text-center text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Chat with Your <span className="text-blue-600">Codebase</span>
        </motion.h1>
        <motion.div
          className="relative mx-auto w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="overflow-y-auto p-4 mb-4 space-y-4 h-96 bg-white rounded-lg border border-gray-200">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-lg shadow-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-blue-500 text-white self-end text-right"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content === "..." ? (
                      <span className="flex justify-center items-center space-x-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full delay-200 animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
                      </span>
                    ) : (
                      message.content
                    )}
                  </motion.div>
                ))}
              </div>
              <motion.form
                onSubmit={handleSubmit}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about the codebase..."
                  className="flex-grow rounded-lg border-gray-300 shadow-sm"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow transition hover:bg-blue-700"
                >
                  {isLoading ? "Thinking..." : "Ask"}
                </Button>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
