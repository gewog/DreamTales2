import { useState, useEffect, useRef, useCallback } from "react";

export function useVoiceReader(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.lang = "ru-RU";
    
    // Attempt to find a good Russian voice
    const setVoice = () => {
      if (!utteranceRef.current) return;
      const voices = window.speechSynthesis.getVoices();
      const ruVoice = voices.find((v) => v.lang === "ru-RU");
      if (ruVoice) {
        utteranceRef.current.voice = ruVoice;
      }
    };
    
    setVoice();
    window.speechSynthesis.onvoiceschanged = setVoice;

    utteranceRef.current.onend = () => setIsPlaying(false);
    utteranceRef.current.onerror = () => setIsPlaying(false);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.rate = speed;
      // If currently playing, we might need to restart to apply speed change smoothly
      if (isPlaying) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  }, [speed, isPlaying]);

  const togglePlay = useCallback(() => {
    if (!utteranceRef.current) return;
    
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel(); // Reset
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { isPlaying, togglePlay, stop, speed, setSpeed };
}
