import Sidebar from "@/components/sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};
export default layout;
