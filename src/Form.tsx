import * as React from 'react';
import './Form.scss';
import { Provider } from './FormContext';
import FormItem, { FormItemComponent } from './FormItem';

interface IFormProps extends React.HTMLAttributes<HTMLFormElement> {
  labelPosition?: 'right' | 'left' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
  rules?: object;
}

function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null;
}

function set(obj: any, keyString: string, value: any) {
  if (!isObject(obj)) {
    return obj;
  }
  let paths;
  if (Object.prototype.hasOwnProperty.call(obj, keyString)) {
    paths = [keyString];
  } else {
    paths = keyString.replace(/(\w)\[(\d+)\]/g, '$1.$2').split('.');
  }

  const length = paths.length;
  const lastIndex = length - 1;
  let index = -1;
  let nested = obj;
  while (++index < length && nested != null) {
    const key = paths[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue = isObject(objValue) ? objValue : +paths[index + 1] >= 0 ? [] : {};
    }
    Object.assign(nested, { [key]: newValue });
    nested = nested[key];
  }
  return obj;
}

function flattenObject(
  path = '',
  obj: any,
  match: (key: string) => boolean,
  callback: (key: string, value: any) => any
) {
  if (match(path)) {
    callback(path, obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((value, index) => flattenObject(`${path}[${index}]`, value, match, callback));
  } else if (isObject(obj)) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      flattenObject(`${path}${path ? '.' : ''}${key}`, value, match, callback);
    });
  }
}

export default class Form extends React.Component<IFormProps, any> {
  static defaultProps = {
    labelPosition: 'right',
    labelSuffix: ' :'
  };

  static Item = FormItem;

  private fields: { [key: string]: FormItemComponent } = {};

  public setFieldsValue = (obj: { [key: string]: any }) => {
    const fieldNames = this.getAllFieldsName();
    const match = (key: string) => fieldNames.indexOf(key) >= 0;
    const setFieldValue = (key: string, value: any) => {
      this.fields[key].setFieldValue(value);
    };
    flattenObject('', obj, match, setFieldValue);
  };

  /**
   * 重置一组控件,不传重置全部
   */
  public resetFields = (keys?: string | string[]) => {
    const fieldNames = keys ? this.getNestedFields(keys) : this.getAllFieldsName();
    fieldNames.forEach((key) => {
      const field = this.fields[key];
      field.resetField();
    });
  };

  /**
   * 获取一组控件的值, 不传返回全部
   */
  public getFieldsValue = (keys?: string | string[]) => {
    const fieldNames = keys ? this.getNestedFields(keys) : this.getAllFieldsName();
    return fieldNames.reduce(
      (acc, cur) => {
        const value = this.fields[cur].state.value;
        set(acc, cur, value);
      },
      {} as any
    );
  };

  public validate() {
    return Promise.all(
      Object.keys(this.fields).map((key) => {
        return this.fields[key].validate('');
      })
    ).then((res) => {
      const result = {};
      res.forEach((v: any) => {
        Object.keys(v).forEach((key) => {
          set(result, key, v[key]);
        });
      });
      return result;
    });
  }

  public render() {
    const { labelPosition, labelSuffix, labelWidth, ...rest } = this.props;
    const ctx = this.getContext();
    return (
      <Provider value={ctx}>
        <form {...rest}>{this.props.children}</form>
      </Provider>
    );
  }

  private getAllFieldsName() {
    return Object.keys(this.fields);
  }

  private getNestedFields(name: string | string[]) {
    const partialNames = Array.isArray(name) ? name : [name];
    return this.getAllFieldsName().filter((fullName) =>
      partialNames.some(
        (partialName) =>
          fullName === partialName || new RegExp(`^${partialName}[.\\[]`).test(fullName)
      )
    );
  }

  private getContext = () => {
    return {
      addField: this.addField,
      removeField: this.removeField,
      ...this.props
    };
  };

  private addField = (field: FormItemComponent) => {
    const key = field.props.prop;
    if (key) {
      this.fields[key] = field;
    }
  };

  private removeField = (field: FormItemComponent) => {
    const key = field.props.prop;
    if (key && this.fields.hasOwnProperty(key)) {
      delete this.fields[key];
    }
  };
}
