import { useState } from "react";
import { useGetTales, useCreateTale, useDeleteTale, CreateTaleInputAgeGroup } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { data: tales, isLoading, refetch } = useGetTales();
  const createTale = useCreateTale();
  const deleteTale = useDeleteTale();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    category: "Волшебные",
    ageGroup: "3-5" as CreateTaleInputAgeGroup,
    duration: 5,
    isFeatured: false,
    author: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTale.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Сказка добавлена!" });
        setIsFormOpen(false);
        refetch();
        setFormData({
          title: "", content: "", imageUrl: "", category: "Волшебные", ageGroup: "3-5", duration: 5, isFeatured: false, author: ""
        });
      },
      onError: (err) => {
        toast({ title: "Ошибка", variant: "destructive" });
        console.error(err);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Удалить сказку?")) {
      deleteTale.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Удалено" });
          refetch();
        }
      });
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 bg-muted/30">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold">Админ Панель</h1>
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md active:scale-95"
          >
            <Plus className={`w-6 h-6 transition-transform ${isFormOpen ? "rotate-45" : ""}`} />
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-3xl shadow-sm border border-border mb-8 space-y-4">
            <h2 className="text-xl font-bold mb-4">Новая сказка</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Название</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-muted border-none rounded-xl p-3 text-base" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Текст (абзацы через Enter)</label>
              <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-muted border-none rounded-xl p-3 text-base h-32" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">URL картинки</label>
              <input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-muted border-none rounded-xl p-3 text-base" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Категория</label>
                <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-muted border-none rounded-xl p-3 text-base" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Возраст</label>
                <select value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value as CreateTaleInputAgeGroup})} className="w-full bg-muted border-none rounded-xl p-3 text-base">
                  <option value="0-3">0-3 лет</option>
                  <option value="3-5">3-5 лет</option>
                  <option value="5-7">5-7 лет</option>
                  <option value="7+">7+ лет</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Время (мин)</label>
                <input required type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full bg-muted border-none rounded-xl p-3 text-base" />
              </div>
              <div className="flex items-center mt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded accent-primary" />
                  <span className="text-sm font-bold">Сказка дня</span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={createTale.isPending} className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg mt-4 flex items-center justify-center">
              {createTale.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "Сохранить"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
            </div>
          ) : tales?.map(tale => (
            <div key={tale.id} className="bg-card p-4 rounded-2xl border border-border flex items-center gap-4">
              <img src={tale.imageUrl || "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=200"} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{tale.title}</h4>
                <p className="text-xs text-muted-foreground">{tale.category} • {tale.ageGroup}</p>
              </div>
              <button 
                onClick={() => handleDelete(tale.id)}
                disabled={deleteTale.isPending}
                className="w-10 h-10 bg-destructive/10 text-destructive rounded-full flex items-center justify-center shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
