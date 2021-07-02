import React from 'react';

import { styleNames } from '../styles';
import {
  AsComponent,
  AsProp,
  makeStyles,
  omitStyles,
  SystemProps,
  TVariant,
} from '../system';

export interface InputFeedbackProps extends SystemProps, AsProp {
  invalid?: boolean;
  color?: TVariant;
}

export const InputFeedback: AsComponent<'div', InputFeedbackProps> =
  React.forwardRef<HTMLLabelElement, InputFeedbackProps>(
    ({ invalid, className, children, as, ...props }, ref) => {
      const styles = makeStyles(props);
      const rest = omitStyles(props);

      const classes = styleNames(
        styles,
        'form-text',
        {
          'text-danger': invalid,
        },
        className
      );

      const Component = as || 'div';

      return (
        <Component ref={ref} className={classes} {...rest}>
          {children}
        </Component>
      );
    }
  );
