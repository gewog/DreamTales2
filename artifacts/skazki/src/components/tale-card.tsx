import { Link } from "wouter";
import { Heart, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Tale } from "@workspace/api-client-react";
import { useFavorites } from "@/hooks/use-favorites";

interface TaleCardProps {
  tale: Tale;
  featured?: boolean;
}

export function TaleCard({ tale, featured = false }: TaleCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(tale.id);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group bg-card rounded-2xl overflow-hidden shadow-sm border border-card-border flex flex-col ${
        featured ? "col-span-full aspect-[4/3]" : "aspect-[3/4]"
      }`}
    >
      <Link href={`/tale/${tale.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Читать {tale.title}</span>
      </Link>
      
      <div className="relative flex-1 overflow-hidden">
        <img
          src={tale.imageUrl || "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600"}
          alt={tale.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(tale.id);
          }}
          className="absolute top-3 right-3 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
        >
          <Heart className={`w-5 h-5 ${favorite ? "fill-accent text-accent" : ""}`} />
        </button>
        
        {featured && (
          <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
            Сказка дня
          </div>
        )}
      </div>

      <div className="p-4 bg-card z-20">
        <h3 className={`font-serif font-bold text-card-foreground leading-tight line-clamp-2 ${featured ? "text-xl mb-2" : "text-base mb-1"}`}>
          {tale.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mt-auto pt-1">
          <span className="px-2 py-1 bg-muted rounded-md">{tale.ageGroup} лет</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tale.duration} мин
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function TaleCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`bg-muted animate-pulse rounded-2xl ${featured ? "col-span-full aspect-[4/3]" : "aspect-[3/4]"}`} />
  );
}
