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
    <section className="px-4 py-20 bg-gray-50">
      <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 border-black">
            <CardHeader>
              <feature.icon className="w-10 h-10 mb-4" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
