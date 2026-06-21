import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { TaleCard, TaleCardSkeleton } from "@/components/tale-card";
import { useGetCategories, useGetFeaturedTales, useGetTales } from "@workspace/api-client-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedAge, setSelectedAge] = useState<string | undefined>();

  const { data: categories } = useGetCategories();
  const { data: featuredTales } = useGetFeaturedTales();

  const { data: tales, isLoading: isLoadingTales } = useGetTales({
    category: selectedCategory,
    ageGroup: selectedAge,
  });

  const ageGroups = ["0-3", "3-5", "5-7", "7+"];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

        {/* Hero */}
        <section className="relative rounded-3xl overflow-hidden mb-8 shadow-lg border border-primary/20">
          <div className="relative aspect-[21/7] sm:aspect-[21/6] w-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.25),transparent_50%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-lg mb-2">
                Сказочный мир
              </h1>
              <p className="text-white/80 text-sm sm:text-base font-medium drop-shadow">
                Волшебные истории для маленьких читателей
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Все сказки
            </button>
            {categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(selectedCategory === c.name ? undefined : c.name)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  selectedCategory === c.name
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {c.emoji && <span>{c.emoji}</span>}
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(selectedAge === age ? undefined : age)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                  selectedAge === age
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-transparent text-muted-foreground hover:border-accent/40"
                }`}
              >
                {age} лет
              </button>
            ))}
          </div>
        </section>

        {/* Featured Tale */}
        {!selectedCategory && !selectedAge && featuredTales && featuredTales.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">✨</span> Сказка дня
            </h2>
            <TaleCard tale={featuredTales[0]} featured />
          </section>
        )}

        {/* Tales Grid */}
        <section>
          <h2 className="text-xl font-serif font-bold mb-4">
            {selectedCategory ? `Сказки: ${selectedCategory}` : "Каталог сказок"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoadingTales
              ? Array.from({ length: 8 }).map((_, i) => <TaleCardSkeleton key={i} />)
              : tales?.length === 0
              ? (
                <div className="col-span-full py-16 text-center text-muted-foreground">
                  <p className="text-lg">К сожалению, сказок не найдено.</p>
                </div>
              )
              : tales?.map((tale, i) => (
                <motion.div
                  key={tale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <TaleCard tale={tale} />
                </motion.div>
              ))
            }
          </div>
        </section>
      </div>
    </Layout>
  );
}
