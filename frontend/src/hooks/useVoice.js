import { useEffect, useRef, useState } from "react";

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return undefined;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const startListening = () =>
    new Promise((resolve, reject) => {
      if (!recognitionRef.current) {
        reject(new Error("Speech recognition is not supported in this browser."));
        return;
      }
      const recognition = recognitionRef.current;
      setIsListening(true);
      recognition.onresult = (event) => {
        setIsListening(false);
        resolve(event.results[0][0].transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
        reject(new Error("Voice capture failed."));
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    });

  const speak = (text) => {
    if (!window.speechSynthesis) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return { isListening, isSpeaking, startListening, speak };
}
