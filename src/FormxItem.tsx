import React, { useEffect, useContext } from 'react';
import FormxContext, { LabelPosition, LabelWidth } from './FormxContext';
import { BindFormxProps } from './useFormx';
import classNames from 'classnames';
import _get from 'lodash/get';

export interface FormxItemProps extends Partial<BindFormxProps> {
  label?: string;
  labelStyle?: object;
  trigger?: string;
  valuePropName?: string;
}

function isObject(obj: any) {
  return obj !== null && typeof obj === 'object';
}

function getValue(event: any) {
  if (!isObject(event) || !event.target) {
    return event;
  }
  const { target } = event;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  return value;
}

function getStyle(labelPosition?: LabelPosition, labelWidth?: LabelWidth) {
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

function FormxItem(props: FormxItemProps & React.HTMLAttributes<HTMLDivElement>) {
  const {
    prop,
    value,
    error,
    required,
    dispatch,
    // above from `bindFormx
    label,
    labelStyle,
    trigger = 'onChange',
    valuePropName = 'value',
    children,
    ...rest
  } = props;

  const { labelPosition, labelSuffix, labelWidth, disabled } = useContext(FormxContext);
  console.log('render', prop);

  useEffect(() => {
    return () => {
      if (prop && dispatch) {
        dispatch({ type: 'unmount', prop, value });
      }
    };
  }, []);

  const message = error && error.message;

  const handleChange = (event: any) => {
    const value = getValue(event);
    if (prop && dispatch) {
      dispatch({ type: 'change', prop, value, error });
    }
  };

  const handleBlur = () => {
    if (prop && dispatch) {
      dispatch({ type: 'blur', prop, value, error });
    }
  };

  const itemClasses = classNames('easy-formx-item', {
    'has-error': error,
    'easy-formx-item--with-help': message
  });
  const labelClasses = classNames('easy-formx-item__label', {
    'is-required': required
  });

  const style = getStyle(labelPosition, labelWidth);

  let items = children;
  if (prop) {
    items = React.Children.map(children, (child, index) => {
      if (index === 0 && React.isValidElement(child)) {
        return React.cloneElement<any>(child, {
          disabled: (child.props as any).disabled || disabled,
          [valuePropName!]: value,
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
          {<span className="esay-formx-item__suffix">{labelSuffix}</span>}
        </label>
      )}
      <div className="easy-formx-item__content" style={style.content}>
        {items}
        {message && <div className="easy-formx-item__error">{message}</div>}
      </div>
    </div>
  );
}

export default FormxItem;
