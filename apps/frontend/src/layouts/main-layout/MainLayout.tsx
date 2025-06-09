"use client";

// import { Navbar } from "@/common/components/NavBar";
import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  IconUser,
} from "@tabler/icons-react";

import {
  AppShell,
  Burger,
  Group,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import Sidebar from "@/common/components/Sidebar";
import classes from "./MainLayout.module.css";
import { useState } from "react";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home" },
  { icon: IconGauge, label: "Dashboard" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebarOpen = () => {
    setSidebarOpen((prev) => !prev);
  };

  const [active, setActive] = useState(2);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <AppShell
      navbar={{
        width: isSidebarOpen ? 200 : 80, // on laptop, expand width if we open sidebar
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
    >
      {/* Navbar */}
      <AppShell.Navbar p="md">
        <Group justify="space-between">
          <Burger
            opened={isSidebarOpen}
            onClick={toggleSidebarOpen}
            size="sm"
          />
        </Group>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>

    /*
    <div className="h-screen">
      <NavBar className="h-[5%]" />
      <div className="h-full pb-[2%]">{children}</div>
    </div>
    */
    // <div className="flex h-screen">
    //   {/* Sidebar */}
    //   <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    // </div>
    // <Shell children={children} header={<></>} navbar={<Navbar />} />
    // I just need a collapsible Navbar
    // <Navbar />

    // ON LAPTOP:
    // sidebar can be expanded or collapsed.
  );
};

export default MainLayout;
