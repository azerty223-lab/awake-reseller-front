"use client";

import * as Toast from "@radix-ui/react-toast";
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/backend/lib/utils";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
}

type ToastFn = (msg: Omit<ToastMessage, "id">) => void;

interface ToastContextValue {
  toast: ToastFn;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Module-level ref so `toast()` can be called from anywhere after mounting
let _globalToast: ToastFn | null = null;

/** Call from anywhere (client components only) after `<Toaster />` has mounted. */
export function toast(msg: Omit<ToastMessage, "id">) {
  _globalToast?.(msg);
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster />");
  return ctx;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    _globalToast = addToast;
    return () => {
      if (_globalToast === addToast) _globalToast = null;
    };
  }, [addToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <Toast.Provider swipeDirection="right">
        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            open
            onOpenChange={(open) => {
              if (!open) setToasts((prev) => prev.filter((x) => x.id !== t.id));
            }}
            className={cn(
              "glass-dark rounded-xl p-4 flex items-start gap-3 shadow-2xl border",
              "data-[state=open]:animate-[slideUp_0.3s_ease-out]",
              t.variant === "success" && "border-emerald-500/30",
              t.variant === "error" && "border-red-500/30",
              t.variant === "info" && "border-blue-500/30",
              !t.variant && "border-[#2a2a2a]"
            )}
          >
            {t.variant && (
              <div className="mt-0.5 shrink-0">{icons[t.variant]}</div>
            )}
            <div className="flex-1 min-w-0">
              <Toast.Title className="text-white font-medium text-sm">
                {t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description className="text-zinc-400 text-xs mt-1">
                  {t.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className="text-zinc-500 hover:text-white transition-colors shrink-0">
              <X className="w-4 h-4" />
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-6 right-6 flex flex-col gap-3 w-[380px] max-w-[calc(100vw-2rem)] z-[100] outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
