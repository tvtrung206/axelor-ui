import React, { useState, useCallback, useEffect } from 'react';

import { TreeNode } from './tree-node';
import { styleNames } from '../styles';
import * as TYPES from './types';
import styles from './tree.module.css';

export function Tree(props: TYPES.TreeProps) {
  const { onLoad, onUpdate, columns, data: _data, nodeRenderer } = props;
  const [data, setData] = useState<TYPES.TreeNode[]>([]);

  const toggle = useCallback(
    async function toggle(record, index, isHover = false) {
      if (!record._loaded && onLoad) {
        record._loaded = true;
        const children: TYPES.TreeNode[] = await onLoad(record);
        setData(data => {
          data.splice(
            index + 1,
            0,
            ...children.map(item => ({
              ...item,
              _parent: record.id,
              _level: (record._level || 0) + 1,
            }))
          );
          return [...data];
        });
      }
      const updateKey = isHover ? '_hover' : '_selected';
      setData(data =>
        data
          .map(_row =>
            _row[updateKey] ? { ..._row, [updateKey]: false } : _row
          )
          .map((_row, i) =>
            i === index
              ? {
                  ..._row,
                  _loaded: true,
                  [updateKey]: true,
                  _expanded: !record._expanded,
                }
              : _row._parent === record.id
              ? { ..._row, _hidden: Boolean(record._expanded) }
              : _row
          )
      );
    },
    [onLoad]
  );

  const select = useCallback(
    async function select(_, record, index) {
      if (record._children) {
        await toggle(record, index);
      } else {
        setData(data =>
          data.map((_row, i) => {
            if (i === index) {
              return { ..._row, _selected: true };
            }
            return _row._selected ? { ..._row, _selected: false } : _row;
          })
        );
      }
    },
    [toggle]
  );

  const drop = useCallback(
    async function drop({ data: dragItem }, { data: hoverItem }) {
      const hoverParent =
        hoverItem._level === dragItem._level ? { id: hoverItem.id } : hoverItem;
      let updatedNode = { ...dragItem };
      if (hoverParent.id !== dragItem._parent && onUpdate) {
        updatedNode = await onUpdate(dragItem, hoverParent);
        updatedNode._parent = hoverParent.id;
      }
      setData(data => {
        const dragIndex = data.indexOf(dragItem);
        const [dragNode] = data.splice(dragIndex, 1);

        const hoverIndex = data.indexOf(hoverItem);
        data.splice(hoverIndex + 1, 0, dragNode);

        return [...data];
      });
    },
    [onUpdate]
  );

  useEffect(() => {
    setData([..._data].map(item => ({ ...item, _level: 0 })));
  }, [_data]);

  return (
    <div className={styles.tree}>
      <div className={styles.header}>
        {columns.map(column => (
          <div
            key={column.name}
            className={styleNames(styles.headerColumn, styles.column)}
          >
            {column.title}
          </div>
        ))}
      </div>
      <div className={styles.body}>
        {data.map(
          (row, rowIndex) =>
            !row._hidden && (
              <TreeNode
                key={rowIndex}
                index={rowIndex}
                columns={columns}
                data={row}
                renderer={nodeRenderer}
                onToggle={toggle}
                onSelect={select}
                onDrop={drop}
              />
            )
        )}
      </div>
    </div>
  );
}
