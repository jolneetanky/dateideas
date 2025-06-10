"use client";

import { Navbar } from "@/layouts/main-layout/NavBar";
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
import classes from "./styles/MainLayout.module.css";
import { useState } from "react";
import { IsSidebarOpenProvider } from "./contexts/IsSidebarOpenContext";

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
    <div className={`${classes.mainLayout}`}>
      <IsSidebarOpenProvider>
        <Navbar />
      </IsSidebarOpenProvider>
      {children}
    </div>
  );
};

export default MainLayout;
