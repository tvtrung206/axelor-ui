import React from 'react';
import { Box } from '../core';
import { useClassNames } from '../core';
import * as TYPES from './types';
import classes from './gantt.module.scss';

const GanttTableHeader = React.memo(function GanttTableHeader({
  items,
}: Pick<TYPES.GanttProps, 'items'>) {
  return (
    <div className={classes.tableHeader}>
      {items.map(item => (
        <div key={item.name} className={classes.tableHeaderCell}>
          {item.title}
        </div>
      ))}
    </div>
  );
});

const GanttTableBodyRow = React.memo(function GanttTableBodyRow({
  active,
  onClick,
  index,
  items,
  data,
}: {
  active: boolean;
  index: number;
  onClick: (index: number) => void;
  data: TYPES.GanttRecord;
  items: TYPES.GanttProps['items'];
}) {
  const classNames = useClassNames();
  return (
    <div
      className={classNames(classes.tableBodyRow, {
        [classes.active]: active,
      })}
      onClick={e => onClick(index)}
    >
      {items.map(item => {
        const value: any = (data as any)[item.name];
        const $value = item.formatter ? item.formatter(data, item) : value;
        function renderer() {
          const Component: any = item.renderer;
          return <Component field={item} data={data} value={$value} />;
        }
        return (
          <div key={item.name} className={classes.tableBodyRowCell}>
            <div className={classes.tableBodyRowCellContent}>
              {item.renderer ? renderer() : $value}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export function GanttTable(props: {
  activeRowIndex: number;
  setActiveRowIndex: (index: number) => void;
  items: TYPES.GanttProps['items'];
  records: TYPES.GanttProps['records'];
}) {
  const { items, records, activeRowIndex, setActiveRowIndex } = props;
  const classNames = useClassNames();
  return (
    <Box className={classNames('table-grid', classes.table)}>
      <GanttTableHeader items={items} />
      <div className={classes.tableBody}>
        {records.map((record, ind) => (
          <GanttTableBodyRow
            key={ind}
            index={ind}
            items={items}
            data={record}
            active={activeRowIndex === ind}
            onClick={setActiveRowIndex}
          />
        ))}
      </div>
    </Box>
  );
}