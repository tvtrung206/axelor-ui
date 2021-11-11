/**
 * @title Header
 */
import React from 'react';
import { Box, Menu, MenuHeader, MenuItem, Button } from '@axelor-ui/core';

export default () => {
  const [show, setShow] = React.useState(false);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  function showMenu() {
    setShow(true);
  }

  function hideMenu() {
    setShow(false);
  }

  return (
    <Box>
      <Button
        ref={setTarget}
        onClick={showMenu}
        bgColor="primary"
        color="light"
      >
        Menu
      </Button>
      <Menu target={target} show={show} onHide={hideMenu}>
        <MenuHeader>Options</MenuHeader>
        <MenuItem href="#option1" onClick={hideMenu}>
          Option 1
        </MenuItem>
        <MenuItem href="#option2" onClick={hideMenu}>
          Option 2
        </MenuItem>
        <MenuItem href="#option3" onClick={hideMenu}>
          Option 3
        </MenuItem>
      </Menu>
    </Box>
  );
};