"use client";

import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";

const HamburgerButton = ({ handleClick }: { handleClick?: () => void }) => {
  const [opened, { toggle }] = useDisclosure();

  const onClick = () => {
    toggle();
    if (handleClick != null) {
      handleClick();
    }
  };

  return <Burger opened={opened} onClick={onClick} />;
};

export default HamburgerButton;
