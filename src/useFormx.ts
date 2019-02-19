import { useReducer, Reducer, useCallback } from 'react';
import Schema from 'async-validator';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _find from 'lodash/find';

export interface BindFormxProps {
  key: string;
  prop: string;
  value: any;
  error: { message: string };
  getRules: (prop: string, trigger?: string) => any;
  setFieldsValue: (value: object) => void;
  validate: (keys?: string[], trigger?: 'change' | 'blur') => void;
}

export interface FormState<T> {
  value: T;
  error: object;
}

export interface Payload {
  type: 'setValue' | 'setError';
  data: object;
}

function init(initialValue: any) {
  return { value: initialValue, error: {} };
}

function reducer(state: FormState<any>, payload: Payload) {
  let { value, error } = state;
  const { type, data } = payload;
  switch (type) {
    case 'setValue':
      Object.keys(data).forEach((key) => {
        _set(value, key, data[key]);
      });
      return { value, error };
    case 'setError':
      Object.keys(data).forEach((key) => {
        _set(error, key, data[key]);
      });
      return { value, error };
    default:
      throw new Error();
  }
}

function useFormx<T extends object>(initialValue: T = {} as any, rules?: object) {
  const [formState, dispatch] = useReducer<Reducer<FormState<T>, Payload>, T>(
    reducer,
    initialValue,
    init
  );

  const setFieldsValue = useCallback(
    (data: object) => {
      dispatch({ type: 'setValue', data });
    },
    [dispatch]
  );

  const setFieldsError = useCallback(
    (data: object) => {
      dispatch({ type: 'setError', data });
    },
    [dispatch]
  );

  const getRules = (prop: string, trigger?: string) => {
    if (!rules || !rules[prop]) {
      return undefined;
    }
    const result = Array.isArray(rules[prop]) ? rules[prop] : [rules[prop]];
    if (!trigger) {
      return result;
    }
    return result.filter((rule: any) => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
    });
  };

  const validate = (keys?: string[], trigger?: 'change' | 'blur') => {
    const allKeys = Object.keys(formState.value);
    const validKeys = keys ? keys.filter((v) => allKeys.indexOf(v) !== -1) : allKeys;
    const descriptor: any = {};
    const data: any = {};
    validKeys.forEach((key) => {
      const rule = getRules(key, trigger);
      const value = _get(formState.value, key);
      data[key] = value;
      if (rule && rule.length) {
        descriptor[key] = rule;
      }
    });
    if (Object.keys(descriptor).length === 0) {
      return Promise.resolve(data);
    }
    return new Promise((resolve, reject) => {
      const validator = new Schema(descriptor);
      validator.validate(data, (errors: any[]) => {
        const error: any = {};
        validKeys.forEach((key) => {
          error[key] = errors && _find(errors, (o) => o.field === key);
        });
        setFieldsError(error);
        if (errors) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  const bindFormx = (prop: string): BindFormxProps => {
    return {
      setFieldsValue,
      validate,
      getRules,
      prop,
      key: prop,
      value: _get(formState.value, prop),
      error: _get(formState.error, prop)
    };
  };

  return { ...formState, bindFormx, validate, setFieldsValue, setFieldsError };
}

export default useFormx;
