import React, { useMemo } from 'react';
import FormxContext, { FormxContextValue } from './FormxContext';
import classNames from 'classnames';

const { Provider } = FormxContext;

function Formx(props: FormxContextValue & React.HTMLAttributes<HTMLFormElement>) {
  const {
    labelPosition = 'right',
    labelSuffix = ':',
    labelWidth,
    rules,
    disabled,
    className,
    ...restProps
  } = props;
  const formProps = { labelPosition, labelWidth, labelSuffix, rules, disabled };
  const memoized = useMemo(
    () => {
      return formProps;
    },
    [JSON.stringify(formProps)]
  );
  const formClasses = classNames('easy-formx', `easy-formx--label-${labelPosition}`, className);
  return (
    <Provider value={memoized}>
      <form className={formClasses} {...restProps} />
    </Provider>
  );
}

export default Formx;
