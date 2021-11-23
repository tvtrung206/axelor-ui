import { Menu } from '../menu/menu';
import { MenuItem } from '../menu/menu-item';
import { MenuDivider } from '../menu/menu-divider';
import { Menubar } from './menubar';

export default {
  component: Menubar,
  title: 'Components/Menubar',
};

export const Basic = () => {
  return (
    <Menubar>
      <Menu text="File">
        <MenuItem text="Share" />
        <MenuDivider />
        <MenuItem text="New">
          <MenuItem text="Document" />
          <MenuItem text="Spreadsheet" />
          <MenuItem text="Image">
            <MenuItem text="JPG" />
            <MenuItem text="PNG" />
          </MenuItem>
        </MenuItem>
        <MenuItem text="Open" disabled />
        <MenuDivider />
        <MenuItem text="Print" label="Ctrl+P" />
      </Menu>
      <Menu text="Edit">
        <MenuItem
          text="Undo"
          startIcon="arrow-counterclockwise"
          label="Ctrl+Z"
        />
        <MenuItem text="Redo" startIcon="arrow-clockwise" label="Ctrl+Y" />
        <MenuDivider />
        <MenuItem text="Cut" startIcon="scissors" label="Ctrl+X" />
        <MenuItem text="Copy" startIcon="clipboard" label="Ctrl+C" />
        <MenuItem text="Paste" startIcon="clipboard-check" label="Ctrl+P" />
      </Menu>
      <Menu text="View">
        <MenuItem text="Print Layout" />
        <MenuDivider />
        <MenuItem text="Mode">
          <MenuItem text="Presentation" />
          <MenuItem text="Edit" />
          <MenuItem text="Modifiable" />
          <MenuItem text="Context">
            <MenuItem text="New" />
            <MenuItem text="Exisiting" />
            <MenuItem text="Shape">
              <MenuItem text="Circle" />
              <MenuItem text="Square" />
              <MenuItem text="Rectangle" />
              <MenuItem text="Triangle" />
            </MenuItem>
          </MenuItem>
        </MenuItem>
      </Menu>
      <Menu text="Format">
        <MenuItem label="Ctrl+B" text="Bold" />
        <MenuItem label="Ctrl+I" text="Italic" />
        <MenuItem label="Ctrl+U" text="Underline" />
      </Menu>
    </Menubar>
  );
};
