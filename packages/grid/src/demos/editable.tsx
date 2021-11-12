/**
 * @title Editable
 */
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Box, FocusTrap, Input } from '@axelor-ui/core';
import { styleNames } from '@axelor-ui/core/styles';
import { Grid } from '../grid';
import { GridState } from '../types';

import { columns, records } from './demo-data';

const FormHandlers = React.createContext(React.createRef<any>());

const FormContext = React.createContext({
  onFocus: (index: number) => {},
  onChange: (name: string, value: any) => {},
  onSave: (editSave?: boolean) => {},
  onCancel: (data?: any, index?: number) => {},
});

function saveRecordAPI(record: any) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!record.name) {
        resolve(null);
      } else {
        resolve({ ...record, id: record.id || Date.now() });
      }
    }, 300);
  });
}

function Form({
  style,
  className,
  children,
  onSave,
  onCancel,
  index,
  data,
}: any) {
  const values = React.useRef({ ...data.record });
  const handlers = React.useContext(FormHandlers);
  const dirty = React.useRef(!data.record.id);
  const currentFocus = React.useRef();

  const handleChange = React.useCallback((name, value) => {
    dirty.current = true;
    values.current = {
      ...values.current,
      [name]: value,
    };
  }, []);

  const handleFocus = React.useCallback(fieldIndex => {
    currentFocus.current = fieldIndex;
  }, []);

  const handleCancel = React.useCallback(() => {
    onCancel && onCancel(values.current, index, currentFocus.current);
  }, [onCancel, index]);

  const handleSave = React.useCallback(
    isSaveFromEdit => {
      const data = values.current;
      return (
        onSave &&
        onSave(
          data,
          index,
          currentFocus.current,
          dirty.current,
          isSaveFromEdit === true
        )
      );
    },
    [onSave, handleCancel, index]
  );

  React.useEffect(() => {
    handlers.current && (handlers.current.save = handleSave);
    return () => {
      handlers.current && (handlers.current.save = null);
    };
  }, [handlers, handleSave]);

  return (
    <FormContext.Provider
      value={React.useMemo(
        () => ({
          onCancel: handleCancel,
          onFocus: handleFocus,
          onChange: handleChange,
          onSave: handleSave,
        }),
        [handleSave, handleChange, handleFocus, handleCancel]
      )}
    >
      <FocusTrap>
        <div {...{ style, className, children }} />
      </FocusTrap>
    </FormContext.Provider>
  );
}

function FormField({ children, style, className, ...rest }: any) {
  const { data, focus, value: _value } = rest;
  const { onFocus, onSave, onChange, onCancel } = React.useContext(FormContext);
  const { name = '', type = '', options } = data || {};
  const [value, setValue] = React.useState(_value === undefined ? '' : _value);
  const initRef = React.useRef(false);

  function handleKeyDown(e: any) {
    if (e.defaultPrevented) return;
    if (e.keyCode === 27 && onCancel) {
      return onCancel(data, rest.index);
    }
    if (e.keyCode === 13 && onSave) {
      return onSave();
    }
  }

  function render() {
    const props = {
      autoFocus: focus,
      value,
      onFocus: () => onFocus && onFocus(rest.index),
      onChange: (e: any) => setValue(e.target.value),
      onKeyDown: handleKeyDown,
    };
    if (options) {
      return (
        <select className={styleNames('form-control')} {...props}>
          <option value="">Select</option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'String') {
      return <Input type="text" {...props} />;
    }
    return null;
  }

  React.useEffect(() => {
    initRef.current && onChange && onChange(name, value);
    initRef.current = true;
  }, [onChange, name, value]);

  return <div {...{ style, className }}>{render()}</div>;
}

export default function () {
  const [$records, setRecords] = React.useState(records);
  const [state, setState] = React.useState<GridState>({
    columns: [],
    rows: [],
  });
  const boxRef = React.useRef<any>();
  const handlers = React.useRef({
    save: (e: boolean) => {},
  });

  const handleRecordAdd = React.useCallback(() => {
    setRecords(records => [...records, {}] as any);
  }, []);

  const handleRecordEdit = React.useCallback(async record => {
    const { save } = handlers.current || {};
    if (save) {
      return await save(true);
    }
  }, []);

  const handleRecordSave = React.useCallback((record, index) => {
    boxRef.current.style.opacity = '0.5';
    return saveRecordAPI(record).then((record: any) => {
      if (record) {
        setRecords(records =>
          records.map((_record, i) => (index === i ? record : _record))
        );
      }
      boxRef.current.style.opacity = null;
      return record;
    });
  }, []);

  const handleRecordDiscard = React.useCallback((record, rowIndex) => {
    if (!record.id) {
      setRecords(records => records.filter((record, i) => i !== rowIndex));
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <FormHandlers.Provider value={handlers}>
        <Box ref={boxRef} style={{ display: 'flex', maxHeight: 500 }}>
          <Grid
            editable
            allowColumnResize
            allowGrouping
            allowSorting
            allowSelection
            allowCheckboxSelection
            allowCellSelection
            sortType="state"
            groupingText={'Drag columns here...'}
            selectionType="multiple"
            records={$records}
            columns={columns}
            state={state}
            setState={setState}
            editRowRenderer={Form}
            editRowColumnRenderer={FormField}
            onRecordAdd={handleRecordAdd}
            onRecordEdit={handleRecordEdit}
            onRecordSave={handleRecordSave}
            onRecordDiscard={handleRecordDiscard}
          />
        </Box>
      </FormHandlers.Provider>
    </DndProvider>
  );
}
