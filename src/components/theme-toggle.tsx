import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme("dark")}
    >
      Toggle Theme
    </button>
  );
}