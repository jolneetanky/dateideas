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
import classes from "./styles/SidebarLinks.module.css";
import { useIsSidebarOpenCtx } from "./contexts/IsSidebarOpenContext";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  const { isSidebarOpen } = useIsSidebarOpenCtx();

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
  // { icon: IconGauge, label: "Dashboard" },
  // { icon: IconDeviceDesktopAnalytics, label: "Analytics" },
  // { icon: IconCalendarStats, label: "Releases" },
  { icon: IconUser, label: "Account" },
  // { icon: IconFingerprint, label: "Security" },
  { icon: IconCalendarStats, label: "Dates" },
  { icon: IconSettings, label: "Settings" },
];

export const SidebarLinks = (): JSX.Element => {
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
    <Stack justify="center" gap={0}>
      {links}
    </Stack>
  );
};

export const Logout = ({ onClick }: { onClick: () => {} }): JSX.Element => {
  const [active, setActive] = useState(false);

  const toggleActive = () => {
    setActive((prev) => !prev);
  };

  return (
    <div className={`${classes.expandedLink}`}>
      <Tooltip
        label="Logout"
        position="right"
        transitionProps={{ duration: 0 }}
      >
        <UnstyledButton
          onClick={onClick}
          className={`${classes.link}`}
          data-active={active || undefined}
        >
          <IconLogout size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </div>
  );
};
