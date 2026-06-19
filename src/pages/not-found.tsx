import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="w-12 h-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">The page you're looking for doesn't exist.</p>
      </div>
      <Link href="/"><Button size="lg">Return to Dashboard</Button></Link>
    </div>
  );
}
