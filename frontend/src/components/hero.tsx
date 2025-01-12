import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-6 py-32 text-white">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h1
          className="mb-6 text-7xl font-extrabold tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-pinkishGlow">
            CODEBASE RAG
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          Upload your GitHub repo and get instant, AI-powered insights into your
          codebase with ease.
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link to="/home">
            <Button
              size="lg"
              className="relative flex items-center justify-center px-10 py-6 text-xl font-bold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-accent to-pinkishGlow hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]"
            >
              Analyze Your Code
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
