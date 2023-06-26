export interface ThemePalette {
  // common colors
  blue?: string;
  indigo?: string;
  purple?: string;
  pink?: string;
  red?: string;
  orange?: string;
  yellow?: string;
  green?: string;
  teal?: string;
  cyan?: string;

  // gray
  white?: string;
  black?: string;
  gray?: string;
  gray_dark?: string;
  gray_100?: string;
  gray_200?: string;
  gray_300?: string;
  gray_400?: string;
  gray_500?: string;
  gray_600?: string;
  gray_700?: string;
  gray_800?: string;
  gray_900?: string;

  // base colors
  body?: string;
  text?: string;

  // theme colors
  primary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  light?: string;
  dark?: string;
}

export interface ThemeTypograpy {
  fontFamily?: string | string[];
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: number | string;
}

export interface ThemeElementColors {
  bg?: string;
  color?: string;
  shadow?: string;
}

export interface ThemeElementBorder {
  width?: string;
  color?: string;
  style?: React.CSSProperties["borderStyle"];
  radius?: string;
}

export interface ThemeElementSpacing {
  padding?: string;
  gap?: string;
}

export interface ThemeElementRing {
  width?: string;
  color?: string;
  opacity?: number;
}

export interface ThemeElementCommon
  extends ThemeTypograpy,
    ThemeElementColors,
    ThemeElementSpacing {
  border?: ThemeElementBorder;
}

export interface ThemeOptions {
  palette?: ThemePalette;
  typography?: {
    body?: ThemeTypograpy;
    code?: ThemeTypograpy;
  };
  border?: ThemeElementBorder;
  link?: {
    color?: string;
    hover?: string;
    decoration?: React.CSSProperties["textDecorationStyle"];
  };
  components?: {
    Input?: {
      border?: ThemeElementBorder;
      focus?: {
        border?: ThemeElementBorder;
        ring?: ThemeElementRing;
      };
      invalid?: {
        color?: string;
        borderColor?: string;
        ringColor?: string;
      };
    };
    Panel?: ThemeElementCommon & {
      title?: ThemeElementSpacing;
      header?: ThemeElementCommon;
      footer?: ThemeElementCommon;
    };
    Table?: ThemeElementCommon & {
      header?: ThemeElementCommon;
      row?: ThemeElementCommon;
      row_odd?: ThemeElementColors;
      row_hover?: ThemeElementColors;
      row_active?: ThemeElementColors;
      cell?: ThemeElementSpacing;
      cell_active?: ThemeElementColors;
    };
    NavMenu?: ThemeElementCommon & {
      width?: string;
      zIndex?: number;
      header?: ThemeElementColors & ThemeElementSpacing;
      item?: ThemeElementColors &
        ThemeElementSpacing & { border?: ThemeElementBorder };
      item_hover?: ThemeElementColors;
      item_active?: ThemeElementColors;
      icon?: ThemeElementColors & ThemeElementSpacing;
      icon_hover?: ThemeElementColors;
      icon_active?: ThemeElementColors;
      buttons?: ThemeElementColors & ThemeElementSpacing & { width?: string };
    };
    NavTabs?: ThemeElementCommon & {
      item?: ThemeElementCommon & {
        transform?: React.CSSProperties["textTransform"];
      };
      item_hover?: ThemeElementColors;
      item_active?: ThemeElementColors;
      icon?: ThemeElementColors & ThemeElementSpacing;
      icon_hover?: ThemeElementColors;
      icon_active?: ThemeElementColors;
      indicator?: {
        bg?: string;
        height?: string;
      };
    };
  };
}
