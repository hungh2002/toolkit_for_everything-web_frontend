"use client";

import { Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useNoteCommandStore } from "@/store/noteCommandStore";

const NoteCommandToolbar = () => {
  const updateNoteCommand = useNoteCommandStore((state) => state.update);

  return (
    <TooltipProvider>
      <div className="flex justify-center">
        <Tooltip>
          <TooltipTrigger onClick={() => updateNoteCommand.save(true)}>
            <Save />
          </TooltipTrigger>
          <TooltipContent>
            <div>save</div>
          </TooltipContent>
        </Tooltip>{" "}
      </div>
    </TooltipProvider>
  );
};
export default NoteCommandToolbar;
