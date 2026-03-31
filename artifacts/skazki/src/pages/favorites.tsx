import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { TaleCard, TaleCardSkeleton } from "@/components/tale-card";
import { useGetTales } from "@workspace/api-client-react";
import { useFavorites } from "@/hooks/use-favorites";

export default function Favorites() {
  const { data: tales, isLoading } = useGetTales();
  const { favorites } = useFavorites();

  const favoriteTales = tales?.filter(t => favorites.includes(t.id)) || [];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Избранное</h1>
        <p className="text-muted-foreground mb-8">Ваши любимые сказки всегда под рукой.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <TaleCardSkeleton key={i} />)
          ) : favoriteTales.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl" role="img" aria-label="broken heart">💔</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Здесь пока пусто</h3>
              <p className="text-muted-foreground">Добавляйте сказки в избранное, нажимая на сердечко.</p>
            </div>
          ) : (
            favoriteTales.map((tale, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={tale.id}
              >
                <TaleCard tale={tale} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
