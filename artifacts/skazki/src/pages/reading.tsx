import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Heart, Lock, Unlock } from "lucide-react";
import { useGetTale } from "@workspace/api-client-react";
import { useVoiceReader } from "@/hooks/use-voice-reader";
import { useFavorites } from "@/hooks/use-favorites";
import { useLock } from "@/contexts/lock-context";

export default function Reading() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = Number(params.id);

  const { data: tale, isLoading } = useGetTale(id, { query: { enabled: !!id } });
  const { isPlaying, togglePlay, speed, setSpeed, stop } = useVoiceReader(tale?.content || "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isLocked, toggleLock } = useLock();

  const handleBack = () => {
    stop();
    setLocation("/");
  };

  const favorite = tale ? isFavorite(tale.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] w-full bg-background flex flex-col">
        <div className="h-[40vh] w-full bg-muted animate-pulse" />
        <div className="flex-1 p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-1/4 bg-muted animate-pulse rounded-lg mb-6" />
          <div className="h-4 w-full bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-full bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!tale) return null;

  return (
    <div className="min-h-[100dvh] w-full bg-background relative flex flex-col">

      {/* Lock overlay — blocks everything except z-[200]+ elements */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            key="reading-lock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[180] pointer-events-auto"
            style={{ background: "rgba(0,0,0,0.05)" }}
          />
        )}
      </AnimatePresence>

      {/* Locked border glow */}
      {isLocked && (
        <div className="pointer-events-none fixed inset-0 z-[199] border-4 border-red-400/60 rounded-none" />
      )}

      {/* Lock button — always on top, always clickable */}
      <button
        onClick={toggleLock}
        title={isLocked ? "Разблокировать" : "Заблокировать для детей"}
        className={`
          fixed top-4 right-4 z-[201] w-12 h-12 flex items-center justify-center rounded-full
          transition-all duration-300 active:scale-90 shadow-lg
          ${isLocked
            ? "bg-red-500 text-white shadow-red-500/40 animate-pulse"
            : "bg-white/30 backdrop-blur-md text-white hover:bg-white/50"
          }
        `}
      >
        {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
      </button>

      {/* Top header — hidden when locked */}
      <AnimatePresence>
        {!isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-[170] p-4 flex items-center justify-between pointer-events-none"
          >
            <button
              onClick={handleBack}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white pointer-events-auto shadow-sm hover:bg-black/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => toggleFavorite(tale.id)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white pointer-events-auto shadow-sm hover:bg-black/30 transition-colors"
            >
              <Heart className={`w-6 h-6 ${favorite ? "fill-accent text-accent" : ""}`} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Illustration — top 40% */}
      <div className="h-[40vh] w-full shrink-0 relative overflow-hidden">
        <img
          src={tale.imageUrl || "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=800"}
          alt={tale.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/30" />
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 relative z-10 overflow-y-auto pb-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 -mt-10">
          <div className="bg-background rounded-3xl p-6 sm:p-8 shadow-sm border border-border">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">
                {tale.category}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                {tale.ageGroup} лет
              </span>
              {tale.author && (
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                  {tale.author}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-6 text-foreground leading-tight">
              {tale.title}
            </h1>

            <div className="prose prose-lg max-w-none text-[18px] sm:text-[20px] leading-[1.8] text-foreground font-sans">
              {tale.content.split("\n").map((paragraph, idx) =>
                paragraph.trim() ? (
                  <p key={idx} className="mb-5">{paragraph}</p>
                ) : (
                  <br key={idx} />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

          {/* Назад — always works (z-index above lock overlay) */}
          <button
            onClick={handleBack}
            className="relative z-[201] h-14 px-6 sm:px-8 bg-muted text-foreground rounded-2xl font-bold text-lg active:scale-95 transition-transform hover:bg-muted/80 min-w-[100px]"
          >
            Назад
          </button>

          {/* Voice controls — hidden when locked */}
          <AnimatePresence>
            {!isLocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() =>
                    setSpeed((s) =>
                      s === 1 ? 1.5 : s === 1.5 ? 2 : s === 2 ? 0.5 : 1
                    )
                  }
                  className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold active:scale-95 transition-transform hover:bg-secondary/20"
                >
                  <span className="text-sm font-bold">{speed}x</span>
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:brightness-105"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Вперёд — shows when locked, always works */}
          {isLocked && (
            <button
              onClick={handleBack}
              className="relative z-[201] h-14 px-6 sm:px-8 bg-primary text-primary-foreground rounded-2xl font-bold text-lg active:scale-95 transition-transform shadow-md min-w-[100px]"
            >
              Вперёд
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
