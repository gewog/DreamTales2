import { useState, useEffect } from "react";

export function useChildrenMode() {
  const [isChildrenMode, setIsChildrenMode] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("skazki_children_mode");
    if (stored) {
      setIsChildrenMode(stored === "true");
    }
  }, []);

  const toggleChildrenMode = () => {
    setIsChildrenMode((prev) => {
      const next = !prev;
      localStorage.setItem("skazki_children_mode", String(next));
      return next;
    });
  };

  return { isChildrenMode, toggleChildrenMode };
}
