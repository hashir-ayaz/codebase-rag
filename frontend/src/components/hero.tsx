import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export default function Hero() {
  return (
    <section className="overflow-hidden relative px-4 py-32 text-white bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="20"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            CODEBASE RAG
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-2xl text-xl text-gray-300 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload your GitHub repo and get instant, AI-powered insights into your
          codebase.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/home">
            <Button
              size="lg"
              className="text-white bg-blue-600 hover:bg-blue-700"
            >
              <Github className="mr-2 w-5 h-5" />
              Analyze Your Code
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute right-0 bottom-0 left-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </section>
  );
}
