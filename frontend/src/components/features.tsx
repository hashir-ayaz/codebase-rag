"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Download, Database, Search } from "lucide-react";

const features = [
  {
    icon: Download,
    title: "Easy Upload",
    description:
      "Simply provide a GitHub repo URL, and we will handle the rest.",
  },
  {
    icon: Database,
    title: "Intelligent Parsing",
    description:
      "Your codebase is chunked and stored efficiently in Chroma DB.",
  },
  {
    icon: Search,
    title: "Instant Answers",
    description:
      "Ask any question about your codebase and get accurate, context-aware responses.",
  },
];

export default function Features() {
  return (
    <section className="px-4 py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="mb-16 text-4xl font-extrabold text-center text-gray-900 md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It <span className="text-blue-600">Works</span>
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className="p-3 mb-5 text-white bg-blue-600 rounded-full w-fit">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="mb-2 text-xl font-bold text-gray-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
