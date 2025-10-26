import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Size = "sm" | "md" | "lg" | "full";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: Size;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: "w-[420px] max-w-[90%]",
  md: "w-[720px] max-w-[94%]",
  lg: "w-[1024px] max-w-[98%]",
  full: "w-full h-full max-w-full rounded-none",
};

export default function ViewModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  showCloseButton = true,
  className,
  id,
}: ViewModalProps) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);

  // mount stays true while animating out so we can play exit animation
  const [mounted, setMounted] = useState<boolean>(isOpen);
  // show controls the classes for enter/exit
  const [show, setShow] = useState<boolean>(isOpen);
  const ANIM_MS = 200;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // next frame to ensure transition from initial to entered state
      requestAnimationFrame(() => setShow(true));
    } else {
      // trigger exit animation then unmount after duration
      setShow(false);
      const t = setTimeout(() => setMounted(false), ANIM_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!mounted) return;

    previouslyFocused.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus when visible
    const focusTimer = setTimeout(() => {
      if (show) panelRef.current?.focus();
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [mounted, show, onClose]);

  if (!mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnBackdropClick) return;
    if (e.target === backdropRef.current) onClose();
  };

  const titleId = id ? `${id}-title` : undefined;

  const panelBase =
    "bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto flex flex-col focus:outline-none";
  const panelClass = `${panelBase} ${sizeClasses[size]} ${className ?? ""}`;

  // Tailwind classes for enter/exit animations
  const backdropClass =
    "fixed inset-0 flex items-center justify-center z-50 p-5 transition-opacity duration-200 ease-out";
  const backdropOpacity = show ? "bg-black/50 opacity-100" : "bg-black/50 opacity-0 pointer-events-none";

  const panelAnim = show
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 -translate-y-2 scale-95";

  const modal = (
    <div
      ref={backdropRef}
      onMouseDown={handleBackdropClick}
      className={`${backdropClass} ${backdropOpacity}`}
      aria-hidden={!isOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        ref={panelRef}
        className={`${panelClass} transform transition-all duration-200 ease-out ${panelAnim}`}
      >
        {(title || showCloseButton) && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <div id={titleId} className="font-semibold">
              {title}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="bg-transparent border-0 cursor-pointer text-3xl leading-none p-1 rounded hover:bg-gray-100"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="p-4 flex-1 overflow-auto">{children}</div>

        {footer && <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : null;
}
