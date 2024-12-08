"use client";

import { useUserStore } from "@/store/userStore";
import { axios } from "@/config/axios";
import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiURLPartName } from "@/config/type";
import { PartialBlock } from "@blocknote/core";
import { ScrollArea } from "./ui/scroll-area";

type DocumentsList = Array<{ id: number; name: string }>;
const DocumentsList = () => {
  const user = useUserStore((state) => state);
  const [documentsList, setDocumentsList] = useState<DocumentsList | []>([]);

  const addDocument = async () => {
    if (!user.isActive) {
      alert("You are not signed in.");
      return;
    }

    const { status, data }: { status: number; data: DocumentsList } =
      await axios.post(
        "/document/create",
        {
          name: "New page",
          content: JSON.stringify([{ type: "paragraph" }] as PartialBlock[]),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { userId: user.userId },
        }
      );

    if (status == 200) {
      setDocumentsList(data);
    }
  };

  const showDocumentsList = documentsList.map((document) => (
    <SidebarMenuItem key={document.id}>
      <SidebarMenuButton asChild>
        <div className="dark:text-slate-300">
          <Link href={`/note/${document.id}`}>{document.name}</Link>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  const getDocumentsList = async () => {
    const { status, data } = await axios.get(ApiURLPartName.GetDocumentsList, {
      headers: { "Content-type": "application/json" },
      params: { userId: user.userId },
    });

    if (status == 200) {
      setDocumentsList(data);
    }
  };

  useEffect(() => {
    if (!user.isActive) return;

    getDocumentsList();
  }, [user.isActive]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarGroupAction title="Add Document" onClick={addDocument}>
        <Plus color="#cbd5e1" /> <span className="sr-only">Add Document</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          <ScrollArea>{showDocumentsList}</ScrollArea>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default DocumentsList;
