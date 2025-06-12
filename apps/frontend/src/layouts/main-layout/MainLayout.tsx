import { Sidebar } from "@/layouts/main-layout/Sidebar";
import { IsSidebarOpenProvider } from "./contexts/IsSidebarOpenContext";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

const MainLayoutStyle = {
  container: {
    display: "flex",
    height: "100vh",
  },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={MainLayoutStyle.container}>
      <IsSidebarOpenProvider>
        <Sidebar />
      </IsSidebarOpenProvider>

      <ThemeToggle />
      {children}
    </div>
  );
};

export default MainLayout;
