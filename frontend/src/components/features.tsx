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
    description: "Simply provide a GitHub repo URL, and we’ll handle the rest.",
  },
  {
    icon: Database,
    title: "Intelligent Parsing",
    description: "Your codebase is chunked and stored efficiently in Chroma DB.",
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
    <section className="px-6 py-12">
      <motion.h2
        className="mb-16 text-5xl font-extrabold text-center text-textLight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Features You’ll Love
      </motion.h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.2 }}
          >
            <Card
              className="h-full bg-secondary border border-gray-700 
              shadow-md hover:shadow-glow hover:animate-glowPulse transition-all"
            >
              <CardHeader className="p-6 flex flex-col items-center text-center">
                <div
                  className="p-4 mb-5 text-white bg-gradient-to-r 
                  from-accent to-pinkishGlow rounded-full w-fit"
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <CardTitle className="mb-2 text-xl font-bold text-textLight">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
