// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import RepoForm from "@/components/RepoForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
      <Card className="w-1/2  border-black border-2 rounded-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Codebase RAG</CardTitle>
          <CardDescription>
            Enter a GitHub repo link to start analyzing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepoForm />
        </CardContent>
        <CardFooter>
          <CardDescription>Make sure the repo is public</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
