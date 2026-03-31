import { Link, useLocation } from "wouter";
import { Home, Heart, Settings } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();
  
  // Hide nav on reading page and admin
  if (location.startsWith("/tale/") || location.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-6">
        <Link href="/" className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Каталог</span>
        </Link>
        <Link href="/favorites" className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${location === "/favorites" ? "text-primary" : "text-muted-foreground"}`}>
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Избранное</span>
        </Link>
        <Link href="/admin" className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${location === "/admin" ? "text-primary" : "text-muted-foreground"}`}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-medium">Админ</span>
        </Link>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto bg-background relative shadow-2xl sm:border-x sm:border-border overflow-hidden flex flex-col pb-16">
      {children}
      <MobileNav />
    </div>
  );
}
