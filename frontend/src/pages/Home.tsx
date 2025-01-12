import RepoForm from "@/components/RepoForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-primary">
      <Card
        className="w-2/3 border border-gray-700 bg-secondary shadow-[0_0_30px_rgba(124,58,237,0.3)]" 
      >
        <CardContent>
          <RepoForm />
        </CardContent>
        <CardFooter className="justify-center">
          <CardDescription className="text-gray-400">
            The repository should be public
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
