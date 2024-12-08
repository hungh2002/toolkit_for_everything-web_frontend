"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import UserButton from "./userButton";
import DocumentsList from "./documentsList";
import NoteCommandToolbar from "./noteCommandToolbar";
import { ThemeToggle } from "./themeToggle";

const NoteSidebar = () => {
  const { open } = useSidebar();

  return (
    <>
      {open ? (
        ""
      ) : (
        <div className="h-fit flex flex-col border-solid border-2 border-sky-500">
          <SidebarTrigger />
          <NoteCommandToolbar />
        </div>
      )}
      <Sidebar>
        {open ? (
          <div className="flex flex-row align-middle">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
        ) : (
          ""
        )}
        <SidebarContent>
          <DocumentsList />
        </SidebarContent>
        <SidebarFooter>
          <UserButton showUserName={true} />
        </SidebarFooter>
      </Sidebar>
      {open ? (
        <div className="h-fit flex flex-col border-solid border-2 border-sky-500">
          <NoteCommandToolbar />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default NoteSidebar;
