import React, { SyntheticEvent } from "react";

export interface GridColumn {
  id?: string;
  name: string;
  type?: string;
  title?: string;
  width?: number;
  minWidth?: number;
  visible?: boolean;
  hidden?: boolean;
  computed?: boolean;
  sort?: boolean;
  editable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  action?: boolean;
  aggregate?: "sum" | "min" | "max" | "avg" | "count";
  formatter?: (column: GridColumn, value: any, record: any) => any;
  renderer?: (props: any) => any;
  $changed?: boolean;
  $css?: string;
}

export interface GridSortColumn {
  name: string;
  order: "asc" | "desc";
}

export interface GridGroup {
  name: string;
}

export interface GridRow {
  key: any;
  type: "row" | "group-row" | "footer-row";
  parent?: string | null;
  aggregate?: any;
  record?: any;
  state?: "open" | "close";
}

export interface GridState {
  rows: GridRow[];
  columns: GridColumn[];
  scrollbar?: null | any[];
  editRow?: null | any[];
  orderBy?: null | GridSortColumn[];
  groupBy?: null | GridGroup[];
  selectedCell?: null | number[];
  selectedRows?: null | number[];
  selectedCols?: null | number[];
}

export type Renderer = (props: any) => React.ReactElement | null;
export type GridStateHandler = (state: GridState) => any;
export type GridLabel =
  | "Sum"
  | "Min"
  | "Max"
  | "Avg"
  | "Count"
  | "items"
  | "Sort Ascending"
  | "Sort Descending"
  | "Group by"
  | "Ungroup"
  | "Hide"
  | "Show"
  | "Customize..."
  | "Groups"
  | "No records found.";

export interface GridProps {
  className?: string;
  records: any[];
  columns: any[];
  state: GridState;
  setState: (state: GridState | GridStateHandler) => void;
  sortType?: "live" | "state";
  resizeType?: "live" | "highlight";
  selectionType?: "single" | "multiple";
  aggregationType?: "group" | "all";
  editable?: boolean;
  allowGrouping?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  allowSelection?: boolean;
  allowCheckboxSelection?: boolean;
  allowCellSelection?: boolean;
  allowCellFocus?: boolean;
  allowColumnOptions?: boolean;
  allowColumnResize?: boolean;
  allowColumnCustomize?: boolean;
  allowColumnHide?: boolean;
  allowRowReorder?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  addNewText?: string | React.ReactNode;
  noRecordsText?: string | React.ReactNode;
  cellRenderer?: Renderer;
  rowRenderer?: Renderer;
  editRowRenderer?: Renderer;
  editRowColumnRenderer?: Renderer;
  headerRowRenderer?: Renderer;
  footerRowRenderer?: Renderer;
  searchRowRenderer?: Renderer;
  searchColumnRenderer?: Renderer;
  rowGroupHeaderRenderer?: Renderer;
  rowGroupFooterRenderer?: Renderer;
  onColumnCustomize?: (e: React.SyntheticEvent, column?: GridColumn) => void;
  onRowClick?: (e: React.SyntheticEvent, row: any, rowIndex: number) => void;
  onRowDoubleClick?: (
    e: React.SyntheticEvent,
    row: GridRow,
    rowIndex: number,
  ) => void;
  onCellClick?: (
    e: React.SyntheticEvent,
    cell: any,
    cellIndex: number,
    row: GridRow,
    rowIndex: number,
  ) => void;
  onRowReorder?: (dragRow: GridRow, hoverRow: GridRow) => void;
  onRecordAdd?: () => void;
  onRecordEdit?: (
    row: any,
    rowIndex?: number,
    cell?: any,
    cellIndex?: number,
  ) => Promise<any>;
  onRecordSave?: (
    record: any,
    recordIndex: number,
    columnIndex: number,
    dirty?: boolean,
    saveFromEdit?: boolean,
  ) => any;
  onRecordDiscard?: (
    record: any,
    recordIndex: number,
    columnIndex: number,
  ) => void;
  onRowSelectionChange?: (rows: number[]) => void;
  translate?: (key: string) => null | string;
  labels?: Record<GridLabel, string>;
}

export interface GridRowProps {
  data: GridRow;
  index: number;
  width?: number;
  draggable?: boolean;
  className?: string;
  children?: any;
  columns?: GridColumn[];
  selected?: boolean;
  selectedCell?: null | number;
  editCell?: number | null;
  renderer?: Renderer;
  cellRenderer?: Renderer;
  selectionType?: GridProps["selectionType"];
  onSave?: GridProps["onRecordSave"];
  onCancel?: GridProps["onRecordDiscard"];
  onCellClick?: GridProps["onCellClick"];
  onDoubleClick?: GridProps["onRowDoubleClick"];
  onMove?: (dragRow: GridRow, hoverRow: GridRow, isFirstRow?: boolean) => void;
  onMoveStart?: (dragInfo: any) => void;
  onClick?: (
    e: SyntheticEvent,
    row: GridRow,
    rowIndex: number,
    columnIndex?: number,
    column?: GridColumn,
  ) => void;
  onUpdate?: (rowIndex: number, values: any) => void;
}

export interface DropObject extends GridColumn {
  $group?: boolean;
}
