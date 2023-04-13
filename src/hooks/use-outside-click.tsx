import { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: (e: MouseEvent | KeyboardEvent) => void
) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        callback(e);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        callback(e);
      }
    });

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
};
