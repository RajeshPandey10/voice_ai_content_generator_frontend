import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/contexts/theme-context";
import { cn } from "@/lib/utils";

export function Layout() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground transition-colors duration-300"
      )}
    >
      <Header />
      <main className="transition-all duration-300">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
