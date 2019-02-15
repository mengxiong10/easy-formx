import { useReducer, useCallback } from 'react';
import Schema from 'async-validator';
import _set from 'lodash/set';

export type LabelPosition = 'right' | 'left' | 'top';
export type LabelWidth = string | number;

interface FormProps {
  initialData?: object;
  labelPosition?: LabelPosition;
  labelWidth?: LabelWidth;
  labelSuffix?: string;
  rules?: object;
  disabled?: boolean;
}

export function useForm(formProps: FormProps = {}) {
  const { rules } = formProps;

  const validateItem = useCallback(
    (trigger: string, prop: string, value: any, cb: (errors?: any[]) => void) => {
      if (!rules || !rules[prop] || !trigger) {
        return;
      }
      const itemRules = [].concat(rules[prop]).filter((rule: any) => {
        return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
      });
      if (!itemRules.length) {
        return;
      }
      const validator = new Schema({ [prop]: rules });
      validator.validate({ [prop]: value }, { first: true }, cb);
    },
    [rules]
  );

  const [formState, setState] = useReducer(
    (state: any, payload: any) => {
      let { data, status } = state;
      const { type, value } = payload;
      if (type === 'setData') {
        data = value;
      } else if (type === 'setStatus') {
        status = value;
      } else {
        Object.keys(value).forEach((key: string) => {
          const val = value[key];
          if (type === 'change') {
            _set(data, key, val);
          }
          validateItem(type, key, val, (errors?: any[]) => {
            _set(status, key, errors && errors[0]);
          });
        });
      }
      return { data, status };
    },
    {
      data: formProps.initialData || {},
      status: {}
    }
  );

  const validate = () => {
    return new Promise((resolve, reject) => {
      const { rules } = formProps;
      const validator = new Schema(rules);
      validator.validate(formState.data, (errors: any[]) => {
        if (errors) {
          const value = errors.reduce((acc, cur) => {
            return { ...acc, [cur.field]: cur };
          }, {});
          setState({ type: 'setStatus', value });
          reject(value);
        } else {
          resolve(formState.data);
        }
      });
    });
  };

  return { formProps, formState, setState, validate };
}
