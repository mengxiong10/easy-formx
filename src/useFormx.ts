import { useReducer } from 'react';
import Schema from 'async-validator';
import _set from 'lodash/set';
import _get from 'lodash/get';

export interface PayloadValidate {
  type: 'validate';
  key: string;
  value: any;
  rules: any;
}

export interface PayloadChange {
  type: 'change';
  key: string;
  value: any;
}

export interface PayloadSetData {
  type: 'setData';
  data: any;
}

export interface PayloadSet {
  type: 'set';
  data?: any;
  status?: any;
}

export interface FormState {
  data: object;
  status: object;
}

type Payload = PayloadChange | PayloadValidate | PayloadSetData | PayloadSet;

function useFormx(initialData: object = {}) {
  const [formState, dispatch] = useReducer(
    (state: FormState, payload: Payload) => {
      let { data, status } = state;
      const { type } = payload;
      if (type === 'change') {
        const { key, value } = payload as PayloadChange;
        _set(data, key, value);
      } else if (type === 'validate') {
        const { key, value, rules } = payload as PayloadValidate;
        const validator = new Schema({ [key]: rules });
        validator.validate({ [key]: value }, { first: true }, (errors?: any[]) => {
          _set(status, key, errors && errors[0]);
        });
      } else if (type === 'setData') {
        data = { ...data, ...(payload as PayloadSetData).data };
      } else if (type === 'set') {
        const { type, ...rest } = payload as PayloadSet;
        return { ...state, ...rest };
      }
      return { data, status };
    },
    {
      data: initialData,
      status: {}
    }
  );

  const validate = (rules: any) => {
    return new Promise((resolve, reject) => {
      const validator = new Schema(rules);
      validator.validate(formState.data, (errors: any[]) => {
        if (errors) {
          const value = errors.reduce((acc, cur) => {
            return { ...acc, [cur.field]: cur };
          }, {});
          dispatch({ type: 'set', status: value });
          reject(value);
        } else {
          resolve({ ...formState.data });
        }
      });
    });
  };

  const bindFormx = (prop: string) => {
    return {
      dispatch,
      prop,
      key: prop,
      value: _get(formState.data, prop),
      error: _get(formState.status, prop)
    };
  };

  return { ...formState, dispatch, validate, bindFormx };
}

export default useFormx;
