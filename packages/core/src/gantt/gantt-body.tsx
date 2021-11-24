import React from 'react';
import { useDrop } from 'react-dnd';

import * as TYPES from './types';
import { CONFIG } from './utils';
import { styleNames } from '../styles';
import classes from './gantt.module.css';

const { DND_TYPES } = CONFIG;

const GanttRowCells = React.memo(function GanttRowCells({
  items,
}: {
  items: TYPES.GanttHeaderItem[];
}) {
  return (
    <>
      {items.map((item, i: number) => (
        <div
          className={styleNames(classes.block, classes.ganttCell)}
          key={i}
          style={{ width: item.width }}
        >
          {' '}
        </div>
      ))}
    </>
  );
});

const GanttRows = React.memo(function GanttRows({
  totalRecords,
  activeRowIndex,
  items,
}: {
  totalRecords: number;
  activeRowIndex: number;
  items: TYPES.GanttHeaderItem[];
}) {
  return (
    <>
      {new Array(totalRecords).fill(0).map((_, i) => (
        <div
          key={i}
          className={styleNames(classes.ganttRow, {
            [classes.active]: activeRowIndex === i,
          })}
        >
          <GanttRowCells items={items} />
        </div>
      ))}
    </>
  );
});

export function GanttBody({
  totalRecords,
  activeRowIndex,
  children,
  items,
}: {
  totalRecords: number;
  activeRowIndex: number;
  children: React.ReactElement | React.ReactElement[];
  items: TYPES.GanttHeaderItem[];
}) {
  const bodyRef = React.useRef<HTMLDivElement>(null);

  const [dropProps, drop] = useDrop({
    accept: [
      DND_TYPES.LINE,
      DND_TYPES.RESIZE_LEFT,
      DND_TYPES.RESIZE_RIGHT,
      DND_TYPES.PROGRESS,
      DND_TYPES.CONNECT_START,
      DND_TYPES.CONNECT_END,
    ],
    hover: (item, monitor) => {
      const dragItem: TYPES.GanttDragItem = monitor.getItem();
      const clientOffset = monitor.getSourceClientOffset();
      const { type, refs, lineRef } = dragItem;
      const dragLine = lineRef?.current;

      if (!dragLine || !clientOffset) return;

      const bound = dragLine.getBoundingClientRect();
      const parentBound = dragLine.parentElement?.getBoundingClientRect();
      const offset = {
        x: clientOffset.x - bound.left,
        y: clientOffset.y - bound.top,
      };
      const { element } = refs.current;

      switch (type) {
        case DND_TYPES.RESIZE_LEFT:
        case DND_TYPES.RESIZE_RIGHT:
          if (parentBound && clientOffset) {
            const offset = {
              x: clientOffset.x - parentBound.left,
              y: clientOffset.y - parentBound.top,
            };
            let width = 0;
            if (dragItem.type === DND_TYPES.RESIZE_LEFT) {
              if (offset.x > element.x) {
                width = element.width - Math.abs(offset.x - element.x);
              } else {
                width = element.width + Math.abs(offset.x - element.x);
              }
              element.width = width > 0 ? width : 0;
              if (width > 0) {
                element.x = offset.x;
              }
            } else {
              width = offset.x - element.x;
              element.width = width > 0 ? width : 0;
            }

            if (dragLine) {
              dragLine.style.left = `${element.x}px`;
              dragLine.style.width = `${element.width}px`;
            }
            refs.current.element = element;
          }
          break;
        case DND_TYPES.PROGRESS:
          const progressElement = dragLine.querySelector(
            `.${classes.ganttLineProgress}`
          );
          const labelElement = dragLine.querySelector(
            `.${classes.ganttLineProgressLabel}`
          );
          const { width } = refs.current.element;
          const value = Math.min(width, offset.x);
          const progressValue = Math.min(
            100,
            (Math.max(0, value) * 100) / refs.current.element.width
          );

          progressElement &&
            ((progressElement as HTMLDivElement).style.width = `${value}px`);
          refs.current.progress = progressValue.toFixed(2);

          if (labelElement) {
            labelElement.innerHTML =
              progressValue > 0 ? `${Math.round(progressValue)}%` : '';
          }
          break;
        case DND_TYPES.LINE:
          if (parentBound) {
            refs.current.element = {
              ...refs.current.element,
              x: clientOffset.x - parentBound.left,
              y: clientOffset.y - parentBound.top,
            };
            dragLine.style.left = `${refs.current.element.x}px`;
          }
          break;
        case DND_TYPES.CONNECT_START:
        case DND_TYPES.CONNECT_END:
          if (parentBound) {
            const connectOffset: TYPES.GanttVirtualLinePoint = {
              x: clientOffset.x - parentBound.left,
              y: clientOffset.y - parentBound.top,
              type: type === DND_TYPES.CONNECT_START ? 'start' : 'finish',
            };
            dragItem.setVirtualLineTarget &&
              dragItem.setVirtualLineTarget(connectOffset);
          }
          break;
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  drop(bodyRef);

  return (
    <div ref={bodyRef} className={classes.ganttBody}>
      <GanttRows
        activeRowIndex={activeRowIndex}
        items={items}
        totalRecords={totalRecords}
      />
      {children}
    </div>
  );
}
