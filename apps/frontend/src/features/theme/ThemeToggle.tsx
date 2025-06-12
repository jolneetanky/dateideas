"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { JSX } from "react";

export const ThemeToggle = (): JSX.Element => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      color={colorScheme === "dark" ? "yellow" : "black"}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        borderRadius: "50%",
      }}
    >
      {colorScheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
};
