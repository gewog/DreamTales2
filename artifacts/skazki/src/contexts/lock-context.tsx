import { createContext, useContext, useState, useEffect } from "react";

interface LockContextValue {
  isLocked: boolean;
  toggleLock: () => void;
}

const LockContext = createContext<LockContextValue>({
  isLocked: false,
  toggleLock: () => {},
});

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("skazki_locked");
    if (stored === "true") setIsLocked(true);
  }, []);

  const toggleLock = () => {
    setIsLocked((prev) => {
      const next = !prev;
      localStorage.setItem("skazki_locked", String(next));
      return next;
    });
  };

  return (
    <LockContext.Provider value={{ isLocked, toggleLock }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  return useContext(LockContext);
}
