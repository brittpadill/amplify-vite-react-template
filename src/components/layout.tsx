import { Link } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { FolderKanban } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary hover:text-primary/80">
            <FolderKanban className="w-6 h-6" />
            <span>Tracker</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
