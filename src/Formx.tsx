import * as React from 'react';
import FormxContext, { FormxContextValue } from './FormxContext';
import classNames from 'classnames';

const { Provider } = FormxContext;

const { useMemo, useCallback } = React;

function Formx(props: FormxContextValue & React.HTMLAttributes<HTMLFormElement>) {
  const {
    labelPosition = 'right',
    labelSuffix = ':',
    labelWidth,
    disabled,
    className,
    ...restProps
  } = props;
  const memoized = useMemo(
    () => {
      return { labelPosition, labelWidth, labelSuffix, disabled };
    },
    [labelPosition, labelWidth, labelSuffix, disabled]
  );
  const formClasses = classNames('easy-formx', `easy-formx--label-${labelPosition}`, className);

  const prevent = useCallback((e: React.FormEvent<HTMLFormElement>) => e.preventDefault(), []);

  return (
    <Provider value={memoized}>
      <form onSubmit={prevent} className={formClasses} {...restProps} />
    </Provider>
  );
}

export default Formx;
