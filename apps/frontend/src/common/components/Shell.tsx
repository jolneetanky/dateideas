"use client";

import { AppShell, Burger, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const Shell = ({
  children,
  header,
  navbar,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  navbar: React.ReactNode;
}) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: rem(60) }}
      navbar={{
        width: { base: opened ? 200 : 60 },
        collapsed: { mobile: false, desktop: true },
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header>{header}</AppShell.Header>
      <AppShell.Navbar>
        <Burger
          variant="subtle"
          pos="absolute"
          top="50%"
          right={0}
          ml="auto"
          bg="var(--mantine-color-body)"
          size="md"
          onClick={toggle}
          hiddenFrom="sm"
          opened={opened}
        />

        <AppShell.Section>{navbar}</AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
