"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function QASection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement question answering logic
    setAnswer("This is a placeholder answer. Implement actual RAG logic here.");
  };

  return (
    <section className="px-4 py-20">
      <h2 className="mb-12 text-3xl font-bold text-center">Leave Feedback</h2>
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            placeholder="Feedback..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full">
            Get Answer
          </Button>
        </form>
        {answer && (
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{answer}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
