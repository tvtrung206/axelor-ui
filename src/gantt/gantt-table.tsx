import React from "react";
import { Box } from "../core";
import { useClassNames } from "../core";
import * as TYPES from "./types";
import classes from "./gantt.module.scss";

function Column({
  field,
  ...props
}: { field: TYPES.GanttField } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...(field.width && {
        style: {
          minWidth: field.width,
          maxWidth: field.width,
        },
      })}
      {...props}
    />
  );
}

const GanttTableHeader = React.memo(function GanttTableHeader({
  items,
}: Pick<TYPES.GanttProps, "items">) {
  return (
    <div className={classes.tableHeader}>
      {items.map((item) => (
        <Column
          key={item.name}
          field={item}
          className={classes.tableHeaderCell}
        >
          {item.title}
        </Column>
      ))}
    </div>
  );
});

const GanttTableBodyRow = React.memo(function GanttTableBodyRow({
  active,
  onClick,
  onView,
  index,
  items,
  data,
}: {
  active: boolean;
  index: number;
  onClick: (index: number) => void;
  data: TYPES.GanttRecord;
  items: TYPES.GanttProps["items"];
  onView?: TYPES.GanttProps["onRecordView"];
}) {
  const classNames = useClassNames();
  return (
    <div
      className={classNames(classes.tableBodyRow, {
        [classes.active]: active,
      })}
      onClick={(e) => onClick(data.id)}
      onDoubleClick={() => onView?.(data, index)}
    >
      {items.map((item) => {
        const value: any = (data as any)[item.name];
        const $value = item.formatter
          ? item.formatter(item, (data as any)[item.name], data)
          : value;
        function renderer() {
          const Component: any = item.renderer;
          return <Component field={item} data={data} value={$value} />;
        }
        return (
          <Column
            key={item.name}
            field={item}
            className={classes.tableBodyRowCell}
          >
            <div className={classes.tableBodyRowCellContent}>
              {item.renderer ? renderer() : $value}
            </div>
          </Column>
        );
      })}
    </div>
  );
});

export function GanttTable(props: {
  activeRow: null | number;
  setActiveRow: (index: number) => void;
  items: TYPES.GanttProps["items"];
  records: TYPES.GanttProps["records"];
  onView?: TYPES.GanttProps["onRecordView"];
}) {
  const { items, records, activeRow, setActiveRow, onView } = props;
  const classNames = useClassNames();
  return (
    <Box className={classNames("table-grid", classes.table)}>
      <GanttTableHeader items={items} />
      <div className={classes.tableBody}>
        {records.map((record, ind) => (
          <GanttTableBodyRow
            key={ind}
            index={ind}
            items={items}
            data={record}
            active={String(activeRow) === String(record.id)}
            onView={onView}
            onClick={setActiveRow}
          />
        ))}
      </div>
    </Box>
  );
}
