import React, { useEffect, useContext } from 'react';
import { DispatchContext } from './FormContext';
import classNames from 'classnames';
import _get from 'lodash/get';
import { LabelPosition, LabelWidth } from './Form';

export interface FormItemProp extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  prop?: string;
  labelStyle?: object;
  trigger?: string;
  valuePropName?: string;
}

function getStyle(labelPosition: LabelPosition, labelWidth: LabelWidth) {
  const label: any = {};
  const content: any = {};
  if (labelPosition === 'left' || labelPosition === 'right') {
    label.textAlign = labelPosition;

    if (labelWidth) {
      label.width = labelWidth;
      content.marginLeft = labelWidth;
    }
  }
  return { label, content };
}

export function FormItem(props: FormItemProp) {
  const {
    label,
    prop,
    labelStyle,
    children,
    valuePropName = 'value',
    trigger = 'onChange',
    ...rest
  } = props;

  const { formProps, formState, setState } = useContext(DispatchContext);

  useEffect(() => {
    return () => {
      if (prop) {
        setState({ type: 'change', value: { [prop!]: undefined } });
      }
    };
  }, []);

  const state = prop && _get(formState.data, prop);
  const error = prop && _get(formState.status, prop);
  const message = error && error.message;

  const handleChange = (...args: any[]) => {
    const e = args[0];
    if (!e || !e.target) {
      return e;
    }
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setState({ type: 'change', value: { [prop!]: value } });
  };

  const handleBlur = () => {
    if (prop) {
      setState({ type: 'blur', value: { [prop]: state } });
    }
  };

  const isRequired = () => {
    const { rules } = formProps;
    let data = prop && rules && rules[prop];
    if (data) {
      data = [].concat(data);
      for (let index = 0; index < data.length; index++) {
        const rule = data[index];
        if (rule.required) {
          return true;
        }
      }
    }
    return false;
  };

  const itemClasses = classNames('easy-formx-item', {
    'has-error': error,
    'easy-formx-item__with-help': message
  });
  const labelClasses = classNames('easy-formx-item__label', {
    'is-required': isRequired()
  });

  const style = getStyle(formProps.labelPosition, formProps.labelWidth);

  let items = children;
  if (prop) {
    items = React.Children.map(children, (child, index) => {
      if (index === 0 && React.isValidElement(child)) {
        const disabled = (child.props as any).disabled || formProps.disabled;
        return React.cloneElement<any>(child, {
          disabled,
          [valuePropName!]: state,
          [trigger!]: handleChange
        });
      }
      return child;
    });
  }
  return (
    <div {...rest} className={itemClasses} onBlur={handleBlur}>
      {label && (
        <label className={labelClasses} style={{ ...style.label, ...labelStyle }}>
          {label}
        </label>
      )}
      <div className="easy-formx-item__content" style={style.content}>
        {items}
        {message && <div className="easy-formx-item__error">{message}</div>}
      </div>
    </div>
  );
}
