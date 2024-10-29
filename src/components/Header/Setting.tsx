import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

export function Setting() {
  return (
    <Menu>
      <MenuButton border="none" as={IconButton} aria-label="Options" icon={<SettingsIcon />} variant="outline" />
      <MenuList>
        <MenuItem icon={<AddIcon />} command="⌘T">
          New Tab
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
