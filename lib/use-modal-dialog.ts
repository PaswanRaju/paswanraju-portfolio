import { type RefObject, useEffect } from "react";

const focusable = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal behavior without a library: Tab and Shift+Tab cycle inside the dialog and the page behind it can't scroll.
// The background is made inert and focus is returned by the component that opens the dialog.
export function useModalDialog(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dialog-open");
    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = ref.current;
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(focusable)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.classList.remove("dialog-open");
    };
  }, [ref]);
}
