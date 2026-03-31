import { Link, useLocation } from "wouter";
import { Home, Heart, Settings, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLock } from "@/contexts/lock-context";

export function LockButton() {
  const { isLocked, toggleLock } = useLock();

  return (
    <button
      onClick={toggleLock}
      title={isLocked ? "Разблокировать" : "Заблокировать для детей"}
      className={`
        relative z-[200] w-11 h-11 flex items-center justify-center rounded-full
        transition-all duration-300 active:scale-90
        ${isLocked
          ? "bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
        }
      `}
    >
      {isLocked
        ? <Lock className="w-5 h-5" />
        : <Unlock className="w-5 h-5" />
      }
    </button>
  );
}

export function GlobalLockOverlay() {
  const { isLocked } = useLock();

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          key="lock-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[150] pointer-events-auto"
          style={{ background: "transparent" }}
        />
      )}
    </AnimatePresence>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  const { isLocked } = useLock();

  if (location.startsWith("/tale/")) return null;

  const isAdmin = location.startsWith("/admin");

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[190] bg-background/90 backdrop-blur-lg border-t border-border transition-all ${isLocked ? "pointer-events-none opacity-60" : ""}`}>
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-6">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Каталог</span>
        </Link>
        <Link
          href="/favorites"
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${location === "/favorites" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Избранное</span>
        </Link>
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isAdmin ? "text-primary" : "text-muted-foreground"}`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">Админ</span>
        </Link>
      </div>
    </div>
  );
}

export function TopBar() {
  const [location] = useLocation();

  if (location.startsWith("/tale/")) return null;

  return (
    <header className="sticky top-0 z-[190] bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-lg text-foreground">
          <span className="text-2xl">🦉</span>
          <span className="hidden sm:inline">Сказочный мир</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Каталог
          </Link>
          <Link href="/favorites" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Избранное
          </Link>
          <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Админ
          </Link>
        </nav>

        <LockButton />
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      <TopBar />
      <GlobalLockOverlay />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
