"use client";

import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import dynamic from "next/dynamic";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { AppBaseURL } from "@/config/type";
import { useRouter } from "next/navigation";
import { useNoteCommandStore } from "@/store/noteCommandStore";
import { useTheme } from "next-themes";
import { useDocument } from "@/hooks/use-document";

export const DynamicImportEditor = dynamic(
  () => import("@/components/editor"),
  { ssr: false }
);

export type Document = { id: number; name: string; content: string };
const Editor = ({ documentId }: { documentId: number | undefined }) => {
  const router = useRouter();
  const user = useUserStore((state) => state);
  const noteCommand = useNoteCommandStore((state) => state);
  const updateNoteCommand = useNoteCommandStore((state) => state.update);
  const { theme, systemTheme } = useTheme();

  const { setContent, editor, getDocument, saveFile } = useDocument(
    documentId,
    user
  );

  window.onkeydown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code == "KeyS") {
      event.preventDefault();

      updateNoteCommand.save(true);
    }
  };

  const getTheme = (theme: string | undefined): "dark" | "light" => {
    switch (theme) {
      case "system":
        if (!systemTheme) return "dark";
        return systemTheme;

      case undefined:
        return "dark";

      default:
        return theme as "dark" | "light";
    }
  };

  useEffect(() => {
    if (!user.isActive) return;

    if (!documentId) {
      router.push(AppBaseURL.Note);
    }

    if (noteCommand.save) {
      saveFile();
      updateNoteCommand.save(false);
    }

    getDocument();
  }, [documentId, noteCommand.save]);

  if (editor && documentId) {
    return (
      <BlockNoteView
        editor={editor}
        theme={getTheme(theme)}
        onChange={() => {
          setContent(editor.document);
        }}
      />
    );
  } else {
    return <div></div>;
  }
};
export default Editor;
