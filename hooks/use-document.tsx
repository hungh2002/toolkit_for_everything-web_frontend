import { axios } from "@/config/axios";
import { ApiURLPartName, AppBaseURL } from "@/config/type";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type Document = { id: number; name: string; content: string };
export type User = { isActive: boolean; userId: number };

export const useDocument = (documentId: number | undefined, user: User) => {
  const router = useRouter();

  const [content, setContent] = useState<PartialBlock[]>([{}]);

  const [document, setDocument] = useState<Document>({
    id: -1,
    name: "",
    content: "",
  });

  const editor = useMemo(() => {
    if (document) {
      if (document.id > 0) {
        return BlockNoteEditor.create({
          initialContent: content,
        });
      }
    }

    return BlockNoteEditor.create();
  }, [document.id]);

  const getDocument = async () => {
    if (!user.isActive || !documentId) return;

    try {
      const { data }: { data: Document } = await axios.get(
        ApiURLPartName.GetDocument,
        {
          params: { documentId: documentId, userId: user.userId },
          headers: { "Content-type": "application/json" },
        }
      );

      setContent(JSON.parse(data.content) as PartialBlock[]);
      setDocument(data);
    } catch (error) {
      const errorResponse = error as AxiosError;
      if (errorResponse.response?.status == 400 && user.isActive) {
        router.push(AppBaseURL.Note);
      }
    }
  };

  const saveFile = async () => {
    await axios.put(
      ApiURLPartName.updateDocument,
      {
        id: document.id,
        name: document.name,
        content: JSON.stringify(content),
      },
      {
        headers: { "Content-type": "application/json" },
        params: { userId: user.userId },
      }
    );
  };

  return { content, setContent, document, editor, getDocument, saveFile };
};
