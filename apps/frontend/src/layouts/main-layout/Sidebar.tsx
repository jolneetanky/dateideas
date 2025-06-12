"use client";
import { Burger, Drawer, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useIsSidebarOpenCtx } from "./contexts/IsSidebarOpenContext";
import classes from "./styles/Navbar.module.css";
import { SidebarLinks, Logout } from "./SidebarLinks";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px");
  const { isSidebarOpen, toggleSidebarOpen, closeSidebar } =
    useIsSidebarOpenCtx();

  return isMobile ? (
    // CASE #1: ON MOBILE
    <div>
      <Burger opened={isSidebarOpen} onClick={toggleSidebarOpen} size="sm" />
      <Drawer opened={isSidebarOpen} onClose={closeSidebar}>
        <SidebarLinks />
        <Logout />
      </Drawer>
    </div>
  ) : (
    // CASE #2: ON LAPTOP
    <nav
      className={`${classes.navbar} ${
        isSidebarOpen ? classes.expandedNavbar : classes.collapsedNavbar
      }`}
    >
      {/* Top of navbar; contains burger */}
      <Group justify="center">
        <Burger opened={isSidebarOpen} onClick={toggleSidebarOpen} size="sm" />
      </Group>

      {/* Sidebar content */}
      <div className={classes.navbarMain}>
        <SidebarLinks />
        <Logout />
      </div>
    </nav>
  );
};
