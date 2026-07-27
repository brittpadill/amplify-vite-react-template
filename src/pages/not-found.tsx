import { Link } from "wouter";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <FileQuestion className="w-14 h-14 text-muted-foreground opacity-40" />
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
      <Link href="/">
        <button className="mt-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors">
          Back to Estimates
        </button>
      </Link>
    </div>
  );
}
