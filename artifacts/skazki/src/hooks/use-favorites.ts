import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("skazki_favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem("skazki_favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}
