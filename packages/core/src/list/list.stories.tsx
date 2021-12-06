import React, { ReactElement, useState } from 'react';

import { Collapse } from '../collapse';
import { Box } from '../box';
import { Icon } from '../icon';
import { List, ListItem } from './list';

export default {
  component: List,
  title: 'Components/List',
};

export const Active = () => {
  return (
    <List>
      <ListItem active>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};

export const Basic = () => {
  return (
    <List>
      <ListItem>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};

const content = (
  <>
    <Box d="flex" w={100} justifyContent="space-between">
      <Box as="h5" mb={1}>
        Lorem ipsum dolor
      </Box>
      <Box as="small" color="muted">
        sit amet
      </Box>
    </Box>
    <Box as="p" mb={1}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a ultrices
      velit.
    </Box>
    <Box as="small" color="muted">
      Fusce a ultrices velit.
    </Box>
  </>
);

export const CustomContent = () => {
  return (
    <List>
      <ListItem active>
        <Box d="flex" w={100} justifyContent="space-between">
          <Box as="h5" mb={1}>
            Lorem ipsum dolor
          </Box>
          <small>sit amet</small>
        </Box>
        <Box as="p" mb={1}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a
          ultrices velit.
        </Box>
        <small>Fusce a ultrices velit.</small>
      </ListItem>
      <ListItem>{content}</ListItem>
      <ListItem>{content}</ListItem>
    </List>
  );
};

export const Disabled = () => {
  return (
    <List>
      <ListItem disabled>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};

export const Flush = () => {
  return (
    <List flush>
      <ListItem>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};

export const FolderList = () => {
  return (
    <List>
      {['archive', 'card-image', 'bank'].map(icon => (
        <ListItem key={icon}>
          <Box d="flex" alignItems="center">
            <Box
              me={2}
              p={2}
              bg="secondary"
              color="white"
              rounded="circle"
              d="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon use={icon} />
            </Box>
            <Box>
              <Box as="p" mb={0}>
                Lorem ipsum
              </Box>
              <Box as="small" color="muted">
                et al dolor el
              </Box>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export const Numbered = () => {
  return (
    <List numbered>
      <ListItem>An item</ListItem>
      <ListItem>A second item</ListItem>
      <ListItem>A third item</ListItem>
      <ListItem>A fourth item</ListItem>
      <ListItem>And a fifth one</ListItem>
    </List>
  );
};

function ListItemIcon({ name }: { name: string }) {
  return (
    <Box as="span" me={2}>
      <Icon use={name} />
    </Box>
  );
}

function NestedList({ children, ...props }: any) {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

  function open(item: string) {
    setActiveMenuItem(item);
  }

  function close() {
    setActiveMenuItem(null);
  }

  return (
    <List style={{ paddingLeft: 16 }} {...props}>
      {React.Children.map(children, item => {
        if (item && (item as ReactElement).type === NestedListItem) {
          return React.cloneElement(item as ReactElement, {
            isOpen: activeMenuItem === (item as ReactElement).props.title,
            onOpen: open,
            onClose: close,
          });
        }
        return item;
      })}
    </List>
  );
}

function NestedListItem({
  children,
  title,
  icon,
  isOpen,
  onOpen,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  icon?: string;
  isOpen?: boolean;
  onOpen?: (title: string) => void;
  onClose?: () => void;
}) {
  const toggle = function () {
    if (isOpen) {
      onClose && onClose();
    } else {
      onOpen && onOpen(title);
    }
  };

  return (
    <ListItem>
      <Box
        d="flex"
        justifyContent="space-between"
        style={{ cursor: 'pointer' }}
        onClick={toggle}
      >
        <Box>
          {icon && <ListItemIcon name={icon} />}
          {title}
        </Box>
        <Icon use={isOpen ? 'chevron-up' : 'chevron-down'} />
      </Box>
      <Collapse in={isOpen}>{children}</Collapse>
    </ListItem>
  );
}

export const Nested = () => {
  return (
    <NestedList>
      <ListItem>
        <ListItemIcon name={'send-fill'} />
        Sent mail
      </ListItem>
      <ListItem>
        <ListItemIcon name={'mailbox'} />
        Drafts
      </ListItem>
      <NestedListItem title="Inbox" icon={'inbox-fill'}>
        <NestedList flush>
          <ListItem>Primary</ListItem>
          <NestedListItem title="Social">
            <List flush>
              <ListItem>Facebook</ListItem>
              <ListItem>Twitter</ListItem>
              <ListItem>Linkedin</ListItem>
            </List>
          </NestedListItem>
          <ListItem>Promotions</ListItem>
          <NestedListItem title="Updates">
            <List flush>
              <ListItem>Github</ListItem>
              <ListItem>Redmine</ListItem>
            </List>
          </NestedListItem>
          <ListItem>Forums</ListItem>
        </NestedList>
      </NestedListItem>
      <NestedListItem title="Outbox" icon={'send-check-fill'}>
        <NestedList flush>
          <ListItem>Primary</ListItem>
          <NestedListItem title="Social">
            <List flush>
              <ListItem>Facebook</ListItem>
              <ListItem>Twitter</ListItem>
              <ListItem>Linkedin</ListItem>
            </List>
          </NestedListItem>
          <ListItem>Promotions</ListItem>
          <NestedListItem title="Updates">
            <List flush>
              <ListItem>Github</ListItem>
              <ListItem>Redmine</ListItem>
            </List>
          </NestedListItem>
          <ListItem>Forums</ListItem>
        </NestedList>
      </NestedListItem>
    </NestedList>
  );
};
