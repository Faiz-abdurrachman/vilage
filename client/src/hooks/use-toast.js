import { useState, useCallback } from 'react';

let toastId = 0;
let globalSetToasts = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  globalSetToasts = setToasts;

  const toast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = ++toastId;
    const newToast = { id, title, description, variant, open: true };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

// Global toast function (usable outside components)
export function toast(options) {
  if (globalSetToasts) {
    const id = ++toastId;
    const newToast = { id, ...options, open: true };
    globalSetToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      globalSetToasts((prev) => prev.filter((t) => t.id !== id));
    }, options.duration || 4000);
  }
}
