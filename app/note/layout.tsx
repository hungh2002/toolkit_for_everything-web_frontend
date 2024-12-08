import NoteSidebar from "@/components/noteSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <NoteSidebar />
      {children}
    </SidebarProvider>
  );
};
export default layout;
