"use client";
import { JSX, useState } from "react";
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
  Burger,
  Drawer,
  Group,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./styles/Navbar.module.css";
import { useIsSidebarOpen } from "./contexts/IsSidebarOpenContext";
interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isSidebarOpen: boolean;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  isSidebarOpen,
}: NavbarLinkProps) {
  return (
    <div>
      <Tooltip
        label={label}
        position="right"
        transitionProps={{ duration: 0 }}
        disabled={isSidebarOpen}
      >
        <UnstyledButton
          onClick={onClick}
          className={`${classes.link} ${
            isSidebarOpen ? classes.expandedLink : classes.collapsedLink
          }`}
          data-active={active || undefined}
        >
          <Icon size={20} stroke={1.5} />
          {isSidebarOpen && <span>{label}</span>}
        </UnstyledButton>
      </Tooltip>
    </div>
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

const SidebarLinks = ({
  isSidebarOpen = true,
}: {
  isSidebarOpen?: boolean;
}): JSX.Element => {
  const [active, setActive] = useState(2);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
      isSidebarOpen={isSidebarOpen}
    />
  ));

  return (
    <Stack justify="center" gap={0}>
      {links}
    </Stack>
  );
};

export const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 768px");
  const { isSidebarOpen, toggleSidebarOpen, closeSidebar } = useIsSidebarOpen();

  const [active, setActive] = useState(2);
  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
      isSidebarOpen={isSidebarOpen}
    />
  ));

  return isMobile ? (
    // CASE #1: ON MOBILE
    <div>
      <Burger opened={isSidebarOpen} onClick={toggleSidebarOpen} size="sm" />
      <Drawer opened={isSidebarOpen} onClose={closeSidebar}>
        <SidebarLinks />
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
        {/* <Stack justify="center" gap={0}>
          {links}
        </Stack> */}
        <SidebarLinks isSidebarOpen={isSidebarOpen} />
      </div>
    </nav>
  );
};
