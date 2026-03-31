import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetTales,
  useGetCategories,
  useCreateTale,
  useDeleteTale,
  CreateTaleInputAgeGroup,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Plus, Trash2, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_FORM = {
  title: "",
  content: "",
  imageUrl: "",
  category: "",
  ageGroup: "3-5" as CreateTaleInputAgeGroup,
  duration: 5,
  isFeatured: false,
  author: "",
};

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: tales, isLoading } = useGetTales();
  const { data: categories } = useGetCategories();
  const createTale = useCreateTale();
  const deleteTale = useDeleteTale();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (categories && categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast({ title: "Выберите категорию", variant: "destructive" });
      return;
    }
    createTale.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({ title: "Сказка добавлена!" });
          setIsFormOpen(false);
          invalidateAll();
          setFormData({
            ...DEFAULT_FORM,
            category: categories?.[0]?.name || "",
          });
        },
        onError: () => {
          toast({ title: "Ошибка при сохранении", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Удалить эту сказку?")) {
      deleteTale.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Сказка удалена" });
            invalidateAll();
          },
          onError: () => {
            toast({ title: "Ошибка при удалении", variant: "destructive" });
          },
        }
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 min-h-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Админ Панель</h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <Plus className={`w-6 h-6 transition-transform duration-200 ${isFormOpen ? "rotate-45" : ""}`} />
          </button>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="bg-card p-6 rounded-3xl shadow-sm border border-border mb-8 space-y-4"
          >
            <h2 className="text-xl font-bold">Новая сказка</h2>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Название *</label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите название сказки"
                className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Текст сказки *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Введите текст сказки. Новые абзацы — через Enter."
                className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary h-40 resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">URL картинки</label>
              <input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Автор</label>
              <input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Например: Русская народная сказка"
                className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Категория *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {!categories || categories.length === 0 ? (
                    <option value="">Загрузка...</option>
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.emoji ? `${c.emoji} ` : ""}{c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Возраст</label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, ageGroup: e.target.value as CreateTaleInputAgeGroup })
                  }
                  className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="0-3">0–3 лет</option>
                  <option value="3-5">3–5 лет</option>
                  <option value="5-7">5–7 лет</option>
                  <option value="7+">7+ лет</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Время чтения (мин)</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={60}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full bg-muted rounded-xl p-3 text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-primary/5 border border-primary/20 w-full hover:bg-primary/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">Сказка дня</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={createTale.isPending}
              className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg mt-2 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
            >
              {createTale.isPending ? (
                <><Loader2 className="animate-spin w-5 h-5" /> Сохраняем...</>
              ) : (
                "Сохранить сказку"
              )}
            </button>
          </form>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-muted-foreground mb-2">
            Все сказки ({tales?.length ?? 0})
          </h2>
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-2xl" />
              ))}
            </div>
          ) : tales?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Сказок пока нет.</div>
          ) : (
            tales?.map((tale) => (
              <div
                key={tale.id}
                className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4"
              >
                <img
                  src={
                    tale.imageUrl ||
                    "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=200"
                  }
                  alt={tale.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold truncate">{tale.title}</h4>
                    {tale.isFeatured && (
                      <Star className="w-4 h-4 text-primary fill-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {tale.category} • {tale.ageGroup} лет • {tale.duration} мин
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(tale.id)}
                  disabled={deleteTale.isPending}
                  className="w-10 h-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shrink-0 hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
