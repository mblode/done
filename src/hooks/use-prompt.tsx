"use client";

import { createRoot } from "react-dom/client";

import {
  RenderPrompt,
  type RenderPromptProps,
} from "@/components/ui/render-prompt";

type UsePromptProps = Omit<
  RenderPromptProps,
  "onConfirm" | "onCancel" | "open"
>;

export const usePrompt = () => {
  const prompt = async (props: UsePromptProps): Promise<boolean> => {
    return new Promise((resolve) => {
      let open = true;

      const onCancel = () => {
        open = false;
        render();
        resolve(false);
      };

      const onConfirm = () => {
        open = false;
        resolve(true);
        render();
      };

      const mountRoot = createRoot(document.createElement("div"));

      const render = () => {
        mountRoot.render(
          <RenderPrompt
            onCancel={onCancel}
            onConfirm={onConfirm}
            open={open}
            {...props}
          />
        );
      };

      render();
    });
  };

  return prompt;
};
