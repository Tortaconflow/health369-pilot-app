"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (finalTranscript: string, interimTranscript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionInstanceRef = useRef<any>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithSpeech = window as any;
      const SpeechRecognitionClass =
        windowWithSpeech.SpeechRecognition ||
        windowWithSpeech.webkitSpeechRecognition ||
        windowWithSpeech.mozSpeechRecognition ||
        windowWithSpeech.msSpeechRecognition;

      setIsSupported(Boolean(SpeechRecognitionClass));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort();
      } catch (e) {}
      try {
        recognitionInstanceRef.current.stop();
      } catch (e) {}
      recognitionInstanceRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscript("");
    setInterimTranscript("");

    if (typeof window === "undefined") return;

    const windowWithSpeech = window as any;
    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition ||
      windowWithSpeech.webkitSpeechRecognition ||
      windowWithSpeech.mozSpeechRecognition ||
      windowWithSpeech.msSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setError("Tu navegador no soporta Speech Recognition. Puedes usar los botones de comando rápido o dictar en Chrome/Edge.");
      setIsSupported(false);
      return;
    }

    try {
      // Abort any existing instance
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch (e) {}
      }

      // Create a fresh instance for every listening session to prevent stale states
      const recognition = new SpeechRecognitionClass();
      recognitionInstanceRef.current = recognition;

      recognition.continuous = optionsRef.current.continuous ?? true;
      recognition.interimResults = optionsRef.current.interimResults ?? true;
      recognition.lang = optionsRef.current.lang || (navigator.language ? navigator.language : "es-MX");
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let final = "";
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript + " ";
          } else {
            interim += res[0].transcript;
          }
        }

        const trimmedFinal = final.trim();
        if (trimmedFinal) {
          setTranscript((prev) => (prev ? `${prev} ${trimmedFinal}` : trimmedFinal));
          if (optionsRef.current.onResult) {
            optionsRef.current.onResult(trimmedFinal, interim);
          }
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event error:", event.error);
        if (event.error === "no-speech") {
          setError("No se detectó audio. Habla claro al micrófono o presiona un comando rápido.");
        } else if (event.error === "not-allowed" || event.error === "permission-denied") {
          setError("Permiso de micrófono no concedido en el navegador.");
        } else if (event.error === "network") {
          setError("Error de conexión con el servicio de voz de Google. Puedes usar los comandos rápidos.");
        } else {
          setError(`Estado de voz: ${event.error}`);
        }
        if (optionsRef.current.onError) {
          optionsRef.current.onError(event.error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (optionsRef.current.onEnd) {
          optionsRef.current.onEnd();
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error("Error al iniciar speech recognition:", err);
      setIsListening(false);
      setError("No se pudo activar el micrófono. Verifica los permisos del navegador.");
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionInstanceRef.current) {
        try {
          recognitionInstanceRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    audioLevel: isListening ? 60 : 0,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
