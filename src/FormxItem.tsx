import React, { useEffect, useContext } from 'react';
import FormxContext, { LabelPosition, LabelWidth } from './FormxContext';
import classNames from 'classnames';
import _get from 'lodash/get';

export interface FormxItemBindProps {
  key: string;
  prop: string;
  value: any;
  error: { message: string };
  dispatch: (payload: any) => void;
}

export interface FormxItemProps extends Partial<FormxItemBindProps> {
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
    dispatch,
    label,
    labelStyle,
    trigger = 'onChange',
    valuePropName = 'value',
    children,
    ...rest
  } = props;

  const { rules, labelPosition, labelSuffix, labelWidth, disabled } = useContext(FormxContext);

  useEffect(() => {
    return () => {
      if (dispatch) {
        dispatch({ type: 'change', key: prop, value: undefined });
      }
    };
  }, []);

  const message = error && error.message;

  const getRules = (trigger: string) => {
    if (!rules || !prop || !rules[prop]) {
      return null;
    }
    return [].concat(rules[prop]).filter((rule: any) => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
    });
  };

  const handleChange = (event: any) => {
    const value = getValue(event);
    if (dispatch) {
      const rules = getRules('change');
      dispatch({ type: 'change', key: prop, value });
      if (rules && rules.length) {
        dispatch({ type: 'validate', key: prop, value, rules });
      }
    }
  };

  const handleBlur = () => {
    if (dispatch) {
      const rules = getRules('blur');
      if (rules && rules.length) {
        dispatch({ type: 'validate', key: prop, value, rules });
      }
    }
  };

  const isRequired = () => {
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
    'easy-formx-item--with-help': message
  });
  const labelClasses = classNames('easy-formx-item__label', {
    'is-required': isRequired()
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
