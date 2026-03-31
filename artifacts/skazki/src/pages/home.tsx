import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { TaleCard, TaleCardSkeleton } from "@/components/tale-card";
import { useGetCategories, useGetFeaturedTales, useGetTales } from "@workspace/api-client-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedAge, setSelectedAge] = useState<string | undefined>();

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const { data: featuredTales, isLoading: isLoadingFeatured } = useGetFeaturedTales();
  
  const { data: tales, isLoading: isLoadingTales } = useGetTales({
    category: selectedCategory,
    ageGroup: selectedAge
  });

  const ageGroups = ["0-3", "3-5", "5-7", "7+"];

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto pb-10">
        {/* Hero Section */}
        <section className="relative pt-12 pb-8 px-6 bg-gradient-to-b from-primary/10 to-background rounded-b-[40px] mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 shrink-0">
              <span className="text-2xl" role="img" aria-label="owl">🦉</span>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Добро пожаловать,</h1>
              <p className="text-muted-foreground text-sm font-medium">в Сказочный мир!</p>
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-primary/20 mb-8">
            <img src="/hero-bg.png" alt="Magical forest" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl font-serif font-bold drop-shadow-md">Время волшебства</h2>
              <p className="text-sm opacity-90 drop-shadow-md">Выберите сказку на ночь</p>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
              <button
                onClick={() => setSelectedCategory(undefined)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                  !selectedCategory ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
                }`}
              >
                Все сказки
              </button>
              {categories?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-colors flex items-center gap-1.5 ${
                    selectedCategory === c.name ? "bg-secondary text-secondary-foreground shadow-md" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.emoji && <span>{c.emoji}</span>}
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
              {ageGroups.map((age) => (
                <button
                  key={age}
                  onClick={() => setSelectedAge(selectedAge === age ? undefined : age)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-colors border ${
                    selectedAge === age ? "border-accent bg-accent/10 text-accent" : "border-border bg-transparent text-muted-foreground"
                  }`}
                >
                  {age} лет
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tale */}
        {!selectedCategory && !selectedAge && featuredTales && featuredTales.length > 0 && (
          <section className="px-6 mb-8">
            <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">✨</span> Сказка дня
            </h3>
            <TaleCard tale={featuredTales[0]} featured />
          </section>
        )}

        {/* Tales Grid */}
        <section className="px-6">
          <h3 className="text-xl font-serif font-bold mb-4">
            {selectedCategory ? `Сказки: ${selectedCategory}` : "Каталог сказок"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {isLoadingTales ? (
              Array.from({ length: 4 }).map((_, i) => <TaleCardSkeleton key={i} />)
            ) : tales?.length === 0 ? (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                <p>К сожалению, сказок не найдено.</p>
              </div>
            ) : (
              tales?.map((tale, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={tale.id}
                >
                  <TaleCard tale={tale} />
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
