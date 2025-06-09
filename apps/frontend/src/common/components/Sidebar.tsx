"use client";
import { Drawer, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  isOpen: () => void;
  handleClose: () => void;
};

const Sidebar = ({ isOpen, handleClose }: Props) => {
  /*
  const content = ["hi", "byetrrrrrr"].map((item, idx) => (
    <div key={idx}>{item}</div>
  ));

  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <>
      <Burger opened={opened} onClick={toggle} />
      <Drawer opened={opened} onClose={close} title="Sidebar">
        {content}
      </Drawer>
    </>
  );
  */
};

export default Sidebar;
