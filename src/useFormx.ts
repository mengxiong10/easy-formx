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
  getRules: (prop: string, trigger?: string) => any;
  setFieldsValue: (value: object) => void;
  validate: (keys?: string[], trigger?: 'change' | 'blur') => void;
}

export interface FormState<T> {
  value: T;
  error: object;
}

export interface Action {
  type: 'setValue' | 'setError' | 'reset';
  payload: object;
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

  return { ...formState, bindFormx, validate, setFieldsValue, setFieldsError, resetFields };
}

export default useFormx;
