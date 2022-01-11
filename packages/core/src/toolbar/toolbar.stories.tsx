import React from 'react';
import { ReactComponent as BiThreeDotsVertical } from 'bootstrap-icons/icons/three-dots-vertical.svg';
import { ReactComponent as BiPlus } from 'bootstrap-icons/icons/plus.svg';
import { ReactComponent as BiPencil } from 'bootstrap-icons/icons/pencil.svg';
import { ReactComponent as BiTrash } from 'bootstrap-icons/icons/trash.svg';
import { ReactComponent as BiArchive } from 'bootstrap-icons/icons/archive.svg';
import { ReactComponent as BiArchiveFill } from 'bootstrap-icons/icons/archive-fill.svg';
import { ReactComponent as BiArrowRepeat } from 'bootstrap-icons/icons/arrow-repeat.svg';

import { Box } from '../box';
import { Icon } from '../icon';
import { ButtonGroup } from '../button-group';
import { Button } from '../button';
import { OverflowList } from '../overflow-list';
import { withStyled } from '../styled';

export default {
  component: OverflowList,
  title: 'Components/Toolbar',
};

type TToolbarItem = {
  title: string;
  icon?: string;
  renderer?: React.ReactNode;
};

const toolbar: {
  items: TToolbarItem[];
} = {
  items: [
    { title: 'New', icon: BiPlus },
    { title: 'Edit', icon: BiPencil },
    { title: 'Delete', icon: BiTrash },
    { title: 'Archive', icon: BiArchive },
    { title: 'Unarchive', icon: BiArchiveFill },
    { title: 'Refresh', icon: BiArrowRepeat },
    {
      title: 'Advance Search',
      renderer: (
        <Box as="label" style={{ whiteSpace: 'nowrap' }}>
          Advance Search
        </Box>
      ),
    },
  ],
};

const ToolbarItem = withStyled(Button)<TToolbarItem>(
  ({ title, icon, renderer, ...rest }, ref) => (
    <Button
      {...rest}
      ref={ref}
      key={icon}
      variant="light"
      d="flex"
      alignItems="center"
      justifyContent="center"
      border
      title={title}
    >
      <span>{renderer ? renderer : icon ? <Icon as={icon} /> : title}</span>
    </Button>
  )
);

interface TOverflowToolbarItem extends TToolbarItem {
  onClick?: () => void;
}

function OverflowToolbarItem({ title, icon, onClick }: TOverflowToolbarItem) {
  return (
    <Box
      key={icon}
      d="flex"
      alignItems="center"
      style={{ minWidth: 100, cursor: 'pointer' }}
      title={title}
      onClick={onClick}
    >
      {icon && (
        <Box d="inline-block" me={2}>
          {' '}
          <Icon as={icon} />
        </Box>
      )}
      {title}
    </Box>
  );
}

function Toolbar() {
  return (
    <OverflowList
      items={toolbar.items}
      as={ButtonGroup}
      renderList={items =>
        items.map((item, index) => (
          <ToolbarItem key={index} {...(item as TToolbarItem)} />
        ))
      }
      renderOverflowItem={(props, index, closePopup) => (
        <OverflowToolbarItem
          key={index}
          {...(props as TOverflowToolbarItem)}
          onClick={closePopup}
        />
      )}
      renderButton={(type, props: any) => {
        if (type === 'dropdown') {
          return <ToolbarItem {...props} icon={BiThreeDotsVertical} />;
        }
        return null;
      }}
    />
  );
}

export const Basic = () => {
  return (
    <Box style={{ marginLeft: 300 }}>
      <Toolbar />
    </Box>
  );
};

export const Multiple = () => {
  return (
    <Box d="flex">
      <Box flex={1} style={{ maxWidth: '50%' }}>
        <Toolbar />
      </Box>
      <Box flex={1} style={{ maxWidth: '50%' }}>
        <Toolbar />
      </Box>
    </Box>
  );
};
