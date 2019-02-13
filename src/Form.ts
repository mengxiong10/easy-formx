import { useReducer } from 'react';
import Schema from 'async-validator';
import _set from 'lodash/set';

interface FormProps {
  initialState?: object;
  labelPosition?: 'right' | 'left' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
  rules?: object;
  disabled?: boolean;
}

function reducer(state: any, newState: any) {
  Object.keys(newState).forEach((key) => {
    _set(state, key, newState[key]);
  });
  return { ...state };
}

export function useForm(formProps: FormProps) {
  const [formState, setState] = useReducer(reducer, formProps.initialState || {});
  const [formStatus, setStatus] = useReducer(reducer, {});

  function getRules(prop: string, trigger: string) {
    if (!formProps.rules || !formProps.rules[prop]) {
      return [];
    }
    const rules = [].concat(formProps.rules[prop]);
    return rules.filter((rule) => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
    });
  }

  const validate = () => {
    return new Promise((resolve, reject) => {
      const { rules } = formProps;
      const validator = new Schema(rules);
      validator.validate(formState, (errors: any) => {
        if (errors) {
          setStatus(
            errors.reduce((acc, cur) => {
              return { ...acc, [cur.field]: cur };
            }, {})
          );
          reject(errors);
        } else {
          resolve(formState);
        }
      });
    });
  };

  const validateItem = ({ trigger, prop, value }) => {
    const rules = getRules(prop, trigger);
    if (!rules.length) {
      return;
    }
    const validator = new Schema({ [prop]: rules });
    validator.validate({ [prop]: value }, { first: true }, (errors) => {
      setStatus({ [prop]: errors && errors[0] });
    });
  };

  return { formProps, formState, formStatus, setState, validateItem, validate };
}
