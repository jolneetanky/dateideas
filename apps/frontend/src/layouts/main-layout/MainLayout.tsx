import { Sidebar } from "@/layouts/main-layout/Sidebar";
import classes from "./styles/MainLayout.module.css";
import { IsSidebarOpenProvider } from "./contexts/IsSidebarOpenContext";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${classes.mainLayout}`}>
      <IsSidebarOpenProvider>
        <Sidebar />
      </IsSidebarOpenProvider>

      <ThemeToggle />
      {children}
    </div>
  );
};

export default MainLayout;
