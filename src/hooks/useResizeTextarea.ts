import { useLayoutEffect } from "react";

export default function useResizeTextarea(textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>, textareaValue: string): void {
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [textareaRef, textareaValue]);
}
