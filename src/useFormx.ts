import { useReducer, Reducer, useCallback } from 'react';
import Schema from 'async-validator';
import _clone from 'lodash/clone';
import _setWith from 'lodash/setWith';
import _get from 'lodash/get';
import _find from 'lodash/find';

export interface BindFormxProps {
  key: string;
  prop: string;
  value: any;
  error: { message: string };
  required: boolean;
  dispatch: (payload: dispatchFieldPayload) => void;
}

export interface FormState<T> {
  value: T;
  error: object;
}

export interface Action {
  type: 'setValue' | 'setError' | 'reset';
  payload: object;
}

export interface dispatchFieldPayload {
  type: 'change' | 'blur' | 'unmount';
  prop: string;
  value: any;
}

// export interface Rule extends any {

// }

function getRules(prop: string, rules?: object, trigger?: string): any[] {
  if (!rules || !rules[prop]) {
    return [];
  }
  const result = Array.isArray(rules[prop]) ? rules[prop] : [rules[prop]];
  if (!trigger) {
    return result;
  }
  return result.filter((rule: any) => {
    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
  });
}

function isRequired(prop: string, rules?: object) {
  let data = getRules(prop, rules);
  if (data.length) {
    for (let index = 0; index < data.length; index++) {
      const rule = data[index];
      if (rule.required) {
        return true;
      }
    }
  }
  return false;
}

function getValidKeys(formValue: object, keys?: string | string[]) {
  const allKeys = Object.keys(formValue);
  if (!keys) {
    return allKeys;
  }
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  return keys.filter((v) => allKeys.indexOf(v) !== -1);
}

function baseValidate(
  formValue: object,
  keys?: string | string[],
  rules?: object,
  trigger?: 'change' | 'blur'
) {
  const descriptor: any = {};
  const data: any = {};
  const validKeys = getValidKeys(formValue, keys);
  validKeys.forEach((key) => {
    const rule = getRules(key, rules, trigger);
    const value = _get(formValue, key);
    data[key] = value;
    if (rule.length) {
      descriptor[key] = rule;
    }
  });
  if (Object.keys(descriptor).length === 0) {
    return Promise.resolve(data);
  }
  return new Promise((resolve, reject) => {
    const validator = new Schema(descriptor);
    validator.validate(data, (errors: any[]) => {
      if (errors) {
        const error: any = {};
        validKeys.forEach((key) => {
          error[key] = _find(errors, (o) => o.field === key);
        });
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function init(initialValue: any) {
  return { value: initialValue, error: {} };
}

function reducer(state: FormState<any>, action: Action) {
  let { value, error } = state;
  const { type, payload } = action;
  switch (type) {
    case 'setValue':
      value = _clone(value);
      Object.keys(payload).forEach((key) => {
        _setWith(value, key, payload[key], _clone);
      });
      return { value, error };
    case 'setError':
      error = _clone(error);
      Object.keys(payload).forEach((key) => {
        _setWith(error, key, payload[key], _clone);
      });
      return { value, error };
    case 'reset':
      return init(payload);
    default:
      throw new Error();
  }
}

function useFormx<T extends object>(initialValue: T = {} as any, rules?: object) {
  const [formState, dispatch] = useReducer<Reducer<FormState<T>, Action>, T>(
    reducer,
    initialValue,
    init
  );

  const setFieldsValue = useCallback((payload: object) => {
    dispatch({ type: 'setValue', payload });
  }, []);

  const setFieldsError = useCallback((payload: object) => {
    dispatch({ type: 'setError', payload });
  }, []);

  const resetFields = useCallback(() => {
    dispatch({ type: 'reset', payload: initialValue });
  }, []);

  const dispatchField = useCallback(
    (payload: dispatchFieldPayload) => {
      const { type, prop, value } = payload;
      if (type === 'unmount') {
        setFieldsValue({ [prop]: undefined });
        return;
      }
      const data = { [prop]: value };
      if (type === 'change') {
        setFieldsValue(data);
      }
      baseValidate(data, prop, rules, type)
        .then(() => {
          setFieldsError({ [prop]: undefined });
        })
        .catch((err) => {
          setFieldsError(err);
        });
    },
    [rules]
  );

  const validate = (keys?: string | string[]) => {
    return baseValidate(formState.value, keys, rules).catch((err) => {
      setFieldsError(err);
      throw err;
    });
  };

  const bindFormx = (prop: string): BindFormxProps => {
    const required = isRequired(prop, rules);
    return {
      required,
      prop,
      key: prop,
      dispatch: dispatchField,
      value: _get(formState.value, prop),
      error: _get(formState.error, prop)
    };
  };

  return { ...formState, bindFormx, validate, setFieldsValue, setFieldsError, resetFields };
}

export default useFormx;
