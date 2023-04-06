import React from "react";
import ReactSelect, {
  components,
  ControlProps,
  IndicatorsContainerProps,
  MenuListProps,
  createFilter,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import { Box } from "../box";
import { useTheme } from "../styles";
import { MaterialIcon, MaterialIconProps } from "../../icons/meterial-icon";
import selectStyles from "./select.module.scss";

export type SelectOption = unknown;

export interface SelectIcon {
  icon: MaterialIconProps["icon"];
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface SelectProps {
  className?: string;
  classNamePrefix?: string;
  placeholder?: string;
  autoFocus?: boolean;
  loading?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
  isCreatable?: boolean;
  isDisabled?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  isClearOnDelete?: boolean;
  value: any;
  onInputChange?: (value: any) => void;
  onChange: (value: any) => void;
  onFocus?: (e: React.SyntheticEvent) => void;
  onBlur?: (e: React.SyntheticEvent) => void;
  onKeyDown?: (e: React.SyntheticEvent) => void;
  options?: SelectOption[];
  addOnOptions?: SelectOption[];
  noOptionsMessage?: () => string;
  fetchOptions?: (searchInput: string) => Promise<unknown>;
  optionLabel?: string | ((option: SelectOption) => string);
  optionValue?: string | ((option: SelectOption) => string);
  icons?: Array<SelectIcon>;
  createOption?: (inputString: string) => React.ReactNode;
  createOptionPosition?: "first" | "last";
  onCreate?: (value: SelectOption) => void;
  isValidNewOption?: (
    inputValue: string,
    selectValue: SelectOption[],
    selectOptions: SelectOption[],
    accessors: any
  ) => boolean;
  components?: any;
}

const ControlContainer = (props: ControlProps<SelectOption, true>) => {
  const { onMouseDown, onTouchEnd } = props.innerProps;
  const { onControlClick } = props.selectProps as any;
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!e.defaultPrevented) {
      onControlClick(e);
      onMouseDown && onMouseDown(e);
    }
  }
  return (
    <components.Control
      {...props}
      innerProps={{
        onMouseDown: handleMouseDown,
        onTouchEnd,
      }}
    />
  );
};

const MenuList = ({ innerProps, ...rest }: MenuListProps) => {
  return (
    <components.MenuList
      {...rest}
      innerProps={{ ...innerProps, ...(rest.isRtl ? { dir: "rtl" } : {}) }}
    />
  );
};

const IndicatorsContainer = (
  props: IndicatorsContainerProps<SelectOption, true>
) => {
  function handleMouseDown(e: React.SyntheticEvent) {
    const { onMenuClose } = props.selectProps || {};
    onMenuClose && onMenuClose();
    e.preventDefault();
  }
  const icons: SelectIcon[] =
    (props.selectProps.components as any)?.icons || [];
  return (
    icons.length > 0 && (
      <Box
        d="flex"
        className={selectStyles.icons}
        {...(icons.some((icon) => icon.onClick)
          ? { onMouseDown: handleMouseDown }
          : {})}
        me={1}
      >
        {icons.map((icon) => (
          <MaterialIcon
            key={icon.icon}
            icon={icon.icon}
            onClick={icon.onClick}
          />
        ))}
      </Box>
    )
  );
};

enum OptionsState {
  FetchNeeded,
  Scheduled,
  Loading,
  Ready,
}

const defaultFilter = createFilter();

function filterOption(candidate: any, input: any) {
  return candidate.data.__isAddOn || defaultFilter(candidate, input);
}

export function Select({
  className,
  classNamePrefix,
  autoFocus,
  placeholder,
  isMulti,
  isClearable = true,
  isDisabled = false,
  isRtl,
  isCreatable = false,
  isSearchable = true,
  loading: _loading,
  value,
  onInputChange,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  options: _options,
  addOnOptions,
  noOptionsMessage,
  fetchOptions,
  icons,
  optionLabel = "label",
  optionValue = "value",
  createOption,
  createOptionPosition = "last",
  onCreate,
  isValidNewOption,
  components,
  ...props
}: SelectProps) {
  const [options, setOptions] = React.useState(_options);
  const [inputText, setInputText] = React.useState("");
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [optionsState, setOptionsState] = React.useState(
    OptionsState.FetchNeeded
  );
  const refs = React.useRef<Record<string, boolean>>({});
  const mounted = React.useRef(false);
  const timer = React.useRef<any>(null);

  const { dir } = useTheme();
  const { isClearOnDelete = !isMulti } = props;
  const rtl = typeof isRtl !== "undefined" ? isRtl : dir === "rtl";

  const setTimer = React.useCallback((callback: any, interval = 500) => {
    setOptionsState(OptionsState.Scheduled);
    timer.current = setTimeout(callback, interval);
  }, []);

  const clearTimer = React.useCallback(() => {
    setOptionsState(OptionsState.Ready);
    timer.current && clearTimeout(timer.current);
  }, []);

  const getOptionLabel = React.useCallback(
    (option: any) => {
      if (option.__isNew__) {
        return option.label;
      }
      return typeof optionLabel === "function"
        ? optionLabel(option)
        : option[optionLabel];
    },
    [optionLabel]
  );
  const getOptionValue = React.useCallback(
    (option: any) =>
      typeof optionValue === "function"
        ? optionValue(option)
        : option[optionValue],
    [optionValue]
  );

  const loadOptionsNow = React.useCallback(
    async (searchString: string) => {
      try {
        if (!fetchOptions) return;
        setOptionsState(OptionsState.Loading);
        const list = await fetchOptions(searchString);
        setOptions(list as SelectOption[]);
      } finally {
        setOptionsState(OptionsState.Ready);
      }
    },
    [fetchOptions]
  );

  const loadOptions = React.useCallback(
    (searchString: string) => {
      clearTimer();
      setTimer(() => loadOptionsNow(searchString), 500);
    },
    [loadOptionsNow, setTimer, clearTimer]
  );

  const handleFocus = React.useCallback(
    (e: React.SyntheticEvent) => {
      setMenuOpen(true);
      return onFocus && onFocus(e);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (e: React.SyntheticEvent) => {
      setOptionsState(OptionsState.FetchNeeded);
      return onBlur && onBlur(e);
    },
    [onBlur]
  );

  const handleChange = React.useCallback(
    (e: any) => {
      setOptionsState(OptionsState.FetchNeeded);
      return onChange && onChange(e);
    },
    [onChange]
  );

  const handleInputChange = React.useCallback((value: any) => {
    setInputText(value);
  }, []);

  React.useEffect(() => {
    onInputChange && onInputChange(inputText);
  }, [onInputChange, inputText]);

  const handleMenuOpen = () => setMenuOpen(true);

  const handleMenuClose = () => {
    if (refs.current.controlClicked) {
      refs.current.controlClicked = false;
    } else {
      setMenuOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isDelete = isClearOnDelete && e.key === "Delete";
    if (
      (isDelete || (!isMulti && isMenuOpen && e.key === "Backspace")) &&
      value
    ) {
      handleChange(null);
    }
    if (isDelete) {
      setInputText("");
    }
    if (!(isMenuOpen && e.key === "Enter")) {
      onKeyDown && onKeyDown(e);
    }
  };

  React.useEffect(() => {
    setOptions(_options);
  }, [_options]);

  React.useEffect(() => {
    mounted.current && isMenuOpen && loadOptions(inputText);
  }, [inputText, isMenuOpen, loadOptions]);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  const SelectComponent = (isCreatable ? CreatableSelect : ReactSelect) as any;

  const canShowNoOptions = React.useMemo(
    () => noOptionsMessage && optionsState === OptionsState.Ready,
    [noOptionsMessage, optionsState]
  );

  const $options = React.useMemo(() => {
    if (optionsState !== OptionsState.Ready) {
      return inputText ? options || [] : [];
    }
    return [
      ...(options || []),
      ...(addOnOptions || []).map((option: any) => ({
        ...option,
        __isAddOn: true,
      })),
    ];
  }, [options, addOnOptions, optionsState, inputText]);

  const hasOption = inputText
    ? ($options || []).some((opt) =>
        (getOptionLabel(opt) || "")
          .toLowerCase()
          .includes(inputText.toLowerCase())
      )
    : ($options || []).length > 0;

  const canShowCreate = React.useMemo(
    () => isCreatable && inputText,
    [isCreatable, inputText]
  );

  const menuIsOpen = React.useMemo(() => {
    return isMenuOpen && (canShowNoOptions || hasOption || canShowCreate);
  }, [isMenuOpen, canShowNoOptions, hasOption, canShowCreate]);

  const styles = {
    option: (styles: any, { data }: any) =>
      data?.__isAddOn || data?.__isNew__
        ? {
            ...styles,
            fontStyle: "italic",
            paddingLeft: "1.5em",
            width: "auto",
          }
        : styles,
  };

  const handleControlClick = (e: React.MouseEventHandler<HTMLElement>) => {
    if (menuIsOpen) {
      refs.current.controlClicked = true;
    }
  };

  return (
    <SelectComponent
      className={className}
      classNamePrefix={classNamePrefix}
      classNames={{
        control: () => selectStyles.control,
        menu: () => selectStyles.menu,
      }}
      menuPortalTarget={document.body}
      menuIsOpen={menuIsOpen}
      menuPlacement="auto"
      styles={styles}
      filterOption={filterOption}
      {...{
        options: $options,
        placeholder,
        isMulti,
        isDisabled,
        isRtl: rtl,
        isClearable,
        isSearchable,
        autoFocus,
        value,
        onChange: handleChange,
        inputValue: inputText,
        onInputChange: handleInputChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        getOptionLabel,
        getOptionValue,
        allowCreateWhileLoading: false,
        closeMenuOnScroll: true,
        openMenuOnClick: true,
        onMenuOpen: handleMenuOpen,
        onMenuClose: handleMenuClose,
        onControlClick: handleControlClick,
        noOptionsMessage: noOptionsMessage || (() => ""),
        components: {
          Control: ControlContainer,
          IndicatorsContainer,
          icons,
          MenuList,
          ...components,
        },
        ...(isCreatable
          ? {
              formatCreateLabel: createOption,
              createOptionPosition,
              onCreateOption: onCreate,
              isValidNewOption,
            }
          : {}),
      }}
    />
  );
}
