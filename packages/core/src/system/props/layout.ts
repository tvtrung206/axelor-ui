import { computeStyle, ComputeStyles, Config } from '../theme';

export type TVerticalAlignment =
  | 'baseline'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'text-top'
  | 'text-bottom';

export type TDimension = 25 | 50 | 75 | 100 | 'auto';

export interface LayoutProps {
  verticalAlign?: TVerticalAlignment;
  overflow?: 'auto' | 'hidden' | 'visible' | 'scroll';
  float?: 'start' | 'end' | 'none';

  w?: TDimension;
  width?: TDimension;

  h?: TDimension;
  height?: TDimension;

  maxW?: boolean;
  maxH?: boolean;

  vw?: boolean;
  vh?: boolean;

  minVW?: boolean;
  minVH?: boolean;
}

export const LayoutConfig: Config<LayoutProps> = {
  verticalAlign: true,
  overflow: true,
  float: true,

  w: true,
  width: true,

  h: true,
  height: true,

  maxW: true,
  maxH: true,

  vw: true,
  vh: true,

  minVW: true,
  minVH: true,
};

export const layoutStyles: ComputeStyles<LayoutProps> = ({
  verticalAlign,
  overflow,
  float,

  w,
  width,

  h,
  height,

  maxW,
  maxH,

  vw,
  vh,

  minVW,
  minVH,
}) => {
  return [
    computeStyle('align', verticalAlign),
    computeStyle('overflow', overflow),
    computeStyle('float', float),
    computeStyle('w', w ?? width),
    computeStyle('h', h ?? height),
    computeStyle('mw', maxW),
    computeStyle('mh', maxH),
    computeStyle('vw', vw),
    computeStyle('vh', vh),
    computeStyle('min-vw', minVW),
    computeStyle('min-vh', minVH),
  ];
};
