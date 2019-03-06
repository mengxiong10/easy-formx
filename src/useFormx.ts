import { useReducer, Reducer, useCallback } from 'react';
import Schema from 'async-validator';
import _clone from 'lodash/clone';
import _setWith from 'lodash/setWith';
import _get from 'lodash/get';
import { getRules, isRequired, getValidKeys, find } from './utils';

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

export interface FormAction {
  type: 'setValue' | 'setError' | 'reset';
  payload: object;
}

export interface dispatchFieldPayload {
  type: 'change' | 'blur' | 'unmount';
  prop: string;
  value: any;
  error?: { message: string };
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
          error[key] = find(errors, (o) => o.field === key);
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

function reducer(state: FormState<any>, action: FormAction) {
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
  const [formState, dispatch] = useReducer<Reducer<FormState<T>, FormAction>, T>(
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

  const dispatchField = useCallback(
    (payload: dispatchFieldPayload) => {
      const { type, prop, value, error } = payload;
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
          if (error) {
            setFieldsError({ [prop]: undefined });
          }
        })
        .catch((err) => {
          setFieldsError(err);
        });
    },
    [rules]
  );

  const resetFields = () => {
    dispatch({ type: 'reset', payload: initialValue });
  };

  const getField = (prop: string) => {
    return [_get(formState.value, prop), _get(formState.error, prop)];
  };

  const validate = (keys?: string | string[]) => {
    return baseValidate(formState.value, keys, rules).catch((err) => {
      setFieldsError(err);
      throw err;
    });
  };

  const bindFormx = (prop: string): BindFormxProps => {
    const required = isRequired(prop, rules);
    const [value, error] = getField(prop);
    return {
      required,
      value,
      error,
      prop,
      key: prop,
      dispatch: dispatchField
    };
  };

  return {
    ...formState,
    bindFormx,
    validate,
    setFieldsValue,
    setFieldsError,
    resetFields,
    getField
  };
}

export default useFormx;
