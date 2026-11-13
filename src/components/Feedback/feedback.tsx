"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

/**
 * Lightweight, provider-free replacement for window.alert / window.confirm.
 * Call `notify()` or `confirmAction()` from anywhere on the client, and mount
 * <FeedbackHost /> once in the root layout.
 */

type Toast = { id: number; message: string; tone: "error" | "info" };
type ConfirmRequest = {
  message: string;
  confirmLabel: string;
  resolve: (ok: boolean) => void;
};

let nextId = 1;
const toastListeners = new Set<(toasts: Toast[]) => void>();
const confirmListeners = new Set<(req: ConfirmRequest | null) => void>();
let toasts: Toast[] = [];
let pendingConfirm: ConfirmRequest | null = null;

const emitToasts = () => toastListeners.forEach((l) => l(toasts));
const emitConfirm = () => confirmListeners.forEach((l) => l(pendingConfirm));

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emitToasts();
}

export function notify(message: string, tone: Toast["tone"] = "error") {
  const id = nextId++;
  toasts = [...toasts, { id, message, tone }];
  emitToasts();
  setTimeout(() => dismissToast(id), 6000);
}

export function confirmAction(
  message: string,
  confirmLabel = "Continue"
): Promise<boolean> {
  // A new request cancels any request still waiting for an answer.
  pendingConfirm?.resolve(false);
  return new Promise((resolve) => {
    pendingConfirm = {
      message,
      confirmLabel,
      resolve: (ok) => {
        pendingConfirm = null;
        emitConfirm();
        resolve(ok);
      },
    };
    emitConfirm();
  });
}

export default function FeedbackHost() {
  const [items, setItems] = useState<Toast[]>(toasts);
  const [request, setRequest] = useState<ConfirmRequest | null>(pendingConfirm);

  useEffect(() => {
    toastListeners.add(setItems);
    confirmListeners.add(setRequest);
    return () => {
      toastListeners.delete(setItems);
      confirmListeners.delete(setRequest);
    };
  }, []);

  useEffect(() => {
    if (!request) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") request.resolve(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [request]);

  return (
    <>
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : undefined}
            className={`flex items-start gap-3 rounded-md border bg-background p-3 text-sm shadow-lg ${
              t.tone === "error" ? "border-destructive" : "border-input"
            }`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              className="shrink-0 opacity-60 hover:opacity-100"
              onClick={() => dismissToast(t.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {request && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => request.resolve(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm action"
            className="relative w-full max-w-md rounded-lg bg-background p-6 shadow-xl"
          >
            <p className="mb-6 text-sm">{request.message}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => request.resolve(false)}>
                Cancel
              </Button>
              <Button autoFocus onClick={() => request.resolve(true)}>
                {request.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
