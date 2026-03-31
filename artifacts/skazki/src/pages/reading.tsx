import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, FastForward, Heart, Settings2, Unlock, Lock } from "lucide-react";
import { useGetTale } from "@workspace/api-client-react";
import { useVoiceReader } from "@/hooks/use-voice-reader";
import { useFavorites } from "@/hooks/use-favorites";
import { useChildrenMode } from "@/hooks/use-children-mode";

export default function Reading() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = Number(params.id);
  
  const { data: tale, isLoading } = useGetTale(id, { query: { enabled: !!id } });
  const { isPlaying, togglePlay, speed, setSpeed, stop } = useVoiceReader(tale?.content || "");
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isChildrenMode, toggleChildrenMode } = useChildrenMode();

  const handleBack = () => {
    stop();
    setLocation("/");
  };

  const favorite = tale ? isFavorite(tale.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto bg-background flex flex-col">
        <div className="h-[40vh] w-full bg-muted animate-pulse rounded-b-3xl" />
        <div className="p-6 flex-1 flex flex-col gap-4">
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
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto bg-background relative flex flex-col">
      {/* Top Header - Hidden in Children Mode */}
      <AnimatePresence>
        {!isChildrenMode && (
          <motion.header 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-none"
          >
            <button
              onClick={handleBack}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white pointer-events-auto shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-3 pointer-events-auto">
              <button
                onClick={() => toggleFavorite(tale.id)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white shadow-sm"
              >
                <Heart className={`w-6 h-6 ${favorite ? "fill-accent text-accent" : ""}`} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Children Mode Toggle (subtle, always available but discreet) */}
      <button 
        onClick={toggleChildrenMode}
        className={`absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full transition-all ${
          isChildrenMode ? "bg-black/20 text-white/50" : "bg-white/30 text-white pointer-events-auto opacity-0"
        } backdrop-blur-md`}
      >
        {isChildrenMode ? <Lock className="w-5 h-5" /> : null}
      </button>

      {/* Illustration */}
      <div className="h-[40vh] w-full shrink-0 relative rounded-b-[40px] overflow-hidden shadow-md">
        <img 
          src={tale.imageUrl || "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600"}
          alt={tale.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/30" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 -mt-10 relative z-10 pb-40 overflow-y-auto">
        <div className="bg-background rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">
              {tale.category}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
              {tale.ageGroup} лет
            </span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-6 text-foreground leading-tight">
            {tale.title}
          </h1>
          
          <div className="prose prose-lg max-w-none text-[19px] leading-relaxed text-foreground font-sans">
            {tale.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[430px] mx-auto bg-background/90 backdrop-blur-xl border-t border-border p-4 pb-safe flex items-center justify-between z-50">
        <button 
          onClick={handleBack}
          className="h-14 px-6 bg-muted text-muted-foreground rounded-2xl font-bold flex items-center justify-center text-lg active:scale-95 transition-transform"
        >
          Назад
        </button>

        {!isChildrenMode && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : s === 2 ? 0.5 : 1)}
              className="w-14 h-14 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold active:scale-95 transition-transform relative"
            >
              <span className="text-sm">{speed}x</span>
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
            </button>
          </div>
        )}

        {isChildrenMode && (
          <button 
            onClick={handleBack} // Or implement "Next Tale" logic here
            className="h-14 px-6 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center text-lg active:scale-95 transition-transform shadow-md"
          >
            Вперёд
          </button>
        )}
      </div>
      
      {/* Children Mode Active Overlay Outline */}
      {isChildrenMode && (
        <div className="pointer-events-none fixed inset-0 z-[100] border-[6px] border-primary/30 rounded-[inherit]" />
      )}
    </div>
  );
}
