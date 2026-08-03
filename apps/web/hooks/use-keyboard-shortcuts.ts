import { useEffect } from "react";

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: "k", ctrl: true, action: () => console.log("Search"), description: "Global search" },
  { key: "n", ctrl: true, action: () => console.log("New"), description: "Create new record" },
  { key: "s", ctrl: true, shift: true, action: () => console.log("Save"), description: "Save current form" },
  { key: "escape", action: () => console.log("Close"), description: "Close dialog" },
];

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find((s) => {
        const keyMatch = e.key.toLowerCase() === s.key.toLowerCase();
        const ctrlMatch = s.ctrl ? e.ctrlKey : true;
        const shiftMatch = s.shift ? e.shiftKey : true;
        const altMatch = s.alt ? e.altKey : true;
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
