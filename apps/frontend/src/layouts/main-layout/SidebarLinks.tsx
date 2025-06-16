"use client";

import { JSX, useState } from "react";
import {
  IconCalendarStats,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

import { Stack, Tooltip, UnstyledButton } from "@mantine/core";
import classes from "./styles/SidebarLinks.module.css";
import { useIsSidebarOpenCtx } from "./contexts/IsSidebarOpenContext";
import Link from "next/link";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  href,
}: NavbarLinkProps) {
  const { isSidebarOpen } = useIsSidebarOpenCtx();

  return (
    <Link href={href ?? ""}>
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
    </Link>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", href: "/" },
  { icon: IconUser, label: "Account" },
  { icon: IconCalendarStats, label: "Dates", href: "/dates" },
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
      href={link.href}
    />
  ));

  return (
    <Stack justify="center" gap={0}>
      {links}
    </Stack>
  );
};

export const Logout = (): JSX.Element => {
  const [active, setActive] = useState(false);

  const toggleActive = () => {
    setActive((prev) => !prev);
  };

  const handleClick = () => {
    toggleActive();
  };

  return (
    <div className={`${classes.expandedLink}`}>
      <Tooltip
        label="Logout"
        position="right"
        transitionProps={{ duration: 0 }}
      >
        <UnstyledButton
          onClick={handleClick}
          className={`${classes.link}`}
          data-active={active || undefined}
        >
          <IconLogout size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </div>
  );
};
