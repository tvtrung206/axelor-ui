import React from "react";
import { Box, Input } from "../core";
import { useClassNames } from "../core";

import { GridColumn } from "./grid-column";
import { isRowCheck, isRowExpand } from "./utils";
import { MaterialIcon } from "../icons/material-icon";
import { GridDNDRow } from "./grid-dnd-row";
import * as TYPES from "./types";
import styles from "./grid.module.scss";

export const GridBodyRow = React.memo(function GridBodyRow(
  props: TYPES.GridRowProps,
) {
  const {
    draggable,
    className,
    columns = [],
    editCell,
    selected,
    selectedCell,
    data,
    index: rowIndex,
    selectionType,
    style,
    width,
    renderer,
    cellRenderer,
    detailsRenderer: RowDetails,
    detailsExpandIcon,
    detailsCollapseIcon,
    onCellClick,
    onDoubleClick,
    onClick,
    onExpand,
    onUpdate,
  } = props;

  const handleUpdate = React.useCallback(
    (values: any) => {
      onUpdate && onUpdate(rowIndex, values);
    },
    [onUpdate, rowIndex],
  );

  const handleCellClick = React.useCallback(
    function handleCellClick(
      e: React.SyntheticEvent,
      cell: TYPES.GridColumn,
      cellIndex: number,
    ) {
      setTimeout(() => {
        onCellClick && onCellClick(e, cell, cellIndex, data, rowIndex);
      }, 50);
      onClick && onClick(e, data, rowIndex, cellIndex, cell);
    },
    [data, rowIndex, onCellClick, onClick],
  );

  function getColumnValue(rawValue: any, column: TYPES.GridColumn) {
    return column.formatter
      ? column.formatter(column, rawValue, data.record)
      : rawValue;
  }

  function getColumnRawValue(column: TYPES.GridColumn) {
    return column.valueGetter
      ? column.valueGetter(column, data.record)
      : data.record[column.name];
  }

  function renderColumn(column: TYPES.GridColumn, value: any) {
    if (isRowCheck(column)) {
      return (
        <Input
          type={selectionType === "single" ? "radio" : "checkbox"}
          checked={selected}
          onChange={() => {}}
          m={0}
          tabIndex={-1}
        />
      );
    }
    if (isRowExpand(column)) {
      const defaultRenderer = (
        <MaterialIcon icon={data.expand ? "arrow_drop_down" : "arrow_right"} />
      );
      return (
        <Box
          d="inline-flex"
          className={styles.expandRowIcon}
          onClick={() => onExpand?.(data)}
        >
          {data.expand
            ? detailsCollapseIcon ?? defaultRenderer
            : detailsExpandIcon ?? defaultRenderer}
        </Box>
      );
    }
    return value;
  }

  const RowComponent = renderer || "div";
  const rendererProps = renderer ? props : {};
  const classNames = useClassNames();
  const DragComponent: any = draggable ? GridDNDRow : React.Fragment;

  return (
    <>
      <DragComponent {...(draggable ? { ...props } : {})}>
        <RowComponent
          {...rendererProps}
          className={classNames(styles.row, className, {
            [styles.selected]: selected,
            [styles.inner]: draggable,
          })}
          style={style}
          onDoubleClick={(e) =>
            onDoubleClick && onDoubleClick(e, data, rowIndex)
          }
        >
          {columns.map((column, index) => {
          const rawValue = getColumnRawValue(column);
          const value = getColumnValue(rawValue, column);
            return (
              <GridColumn
                key={column.id ?? column.name}
                data={column}
                index={index}
                type="body"
                record={data.record}
                value={value}
                rawValue={rawValue}
                focus={editCell === index}
                selected={selectedCell === index}
                renderer={column.renderer || cellRenderer}
                onClick={handleCellClick}
                onUpdate={handleUpdate}
              >
                {renderColumn(column, value)}
              </GridColumn>
            );
          })}
        </RowComponent>
      </DragComponent>
      {RowDetails && data.expand && (
        <div data-row-details={`${data.key}`} style={{ width }}>
          <RowDetails data={data} onClose={() => onExpand?.(data)} />
        </div>
      )}
    </>
  );
});
