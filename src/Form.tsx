import * as React from 'react';
import './Form.scss';
import { Provider } from './FormContext';
import FormItem, { FormItemComponent } from './FormItem';

interface IFormProps extends React.HTMLAttributes<HTMLFormElement> {
  labelPosition?: 'right' | 'left' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
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
      newValue = isObject(objValue)
        ? objValue
        : +paths[index + 1] >= 0
        ? []
        : {};
    }
    Object.assign(nested, { [key]: newValue });
    nested = nested[key];
  }
  return obj;
}

export default class Form extends React.Component<IFormProps, any> {
  static defaultProps = {
    labelPosition: 'right',
    labelSuffix: ' :'
  };

  static Item = FormItem;

  fields: { [key: string]: FormItemComponent } = {};

  resetFields = () => {
    Object.keys(this.fields).forEach(key => {
      const field = this.fields[key];
      field.resetField();
    });
  }

  setFieldsValue = (obj: { [key: string]: any }) => {
    Object.keys(obj).forEach(key => {
      if (this.fields.hasOwnProperty(key)) {
        this.fields[key].setFieldValue(obj[key]);
      }
    });
  }

  // 获取一组控件的值, 不传返回全部
  getFieldsValue = (keys?: string[]) => {
    const result: any = {};
    if (Array.isArray(keys) && keys.length) {
      keys.forEach(key => {
        if (this.fields.hasOwnProperty(key)) {
          set(result, key, this.fields[key].state.value);
        } else {
          set(result, key, undefined);
        }
      });
    } else {
      Object.keys(this.fields).forEach(key => {
        set(result, key, this.fields[key].state.value);
      });
    }
    return result;
  }

  validate() {
    return Promise.all(
      Object.keys(this.fields).map(key => {
        return this.fields[key].validate('');
      })
    ).then(res => {
      const result = {};
      res.forEach((v: any) => {
        Object.keys(v).forEach(key => {
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

  private getContext = () => {
    return {
      addField: this.addField,
      removeField: this.removeField,
      labelPosition: this.props.labelPosition!,
      labelSuffix: this.props.labelSuffix!,
      labelWidth: this.props.labelWidth
    };
  }

  private addField = (field: FormItemComponent) => {
    const key = field.props.prop;
    if (key) {
      this.fields[key] = field;
    }
  }

  private removeField = (field: FormItemComponent) => {
    const key = field.props.prop;
    if (key && this.fields.hasOwnProperty(key)) {
      delete this.fields[key];
    }
  }
}
