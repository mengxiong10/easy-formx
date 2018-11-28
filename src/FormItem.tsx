import * as React from 'react';
import Schema from 'async-validator';
import classNames from 'classnames';
import { Consumer } from './FormContext';

export interface IFormItemProps {
  label?: string;
  prop?: string;
  initialValue?: any; // 用于初始化 和 重置
  rules?: any;
  required?: boolean; // 快捷设置 rules
  labelWidth?: number | string;
  ctx: any;
}

export class FormItemComponent extends React.Component<IFormItemProps, any> {
  static defaultProps = {
    initialValue: ''
  };

  constructor(props: IFormItemProps) {
    super(props);
    this.state = {
      value: props.initialValue,
      valid: true,
      error: ''
    };
  }

  resetField = () => {
    this.setState({
      value: this.props.initialValue,
      valid: true,
      error: ''
    });
  };

  setFieldValue = (value: any) => {
    this.setState({
      value,
      valid: true,
      error: ''
    });
  };

  isRequired() {
    const rules = this.getRules();
    for (let index = 0; index < rules.length; index++) {
      const rule = rules[index];
      if (rule.required) {
        return true;
      }
    }
    return false;
  }

  getRules() {
    const { required, ctx, prop } = this.props;
    const formRules = ctx.rules && prop && ctx.rules[prop];
    const rules = this.props.rules || formRules;
    const defaultRequired = [{ required: true, message: 'required', trigger: 'blur' }];
    if (!rules) {
      return required ? defaultRequired : [];
    }
    const result: any[] = [].concat(rules);
    if (required) {
      for (let index = 0; index < result.length; index++) {
        const rule = result[index];
        if (rule.required) {
          return result;
        }
      }
      return defaultRequired.concat(result);
    }
    return result;
  }

  getFilteredRule(trigger: string) {
    const rules = this.getRules();

    return rules.filter((rule) => {
      return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
    });
  }

  validate(trigger: string) {
    return new Promise((resolve, reject) => {
      const rules = this.getFilteredRule(trigger);
      if (!this.props.prop) {
        return resolve();
      }
      const model = { [this.props.prop]: this.state.value };

      if (rules.length === 0) {
        return resolve(model);
      }
      const descriptor = { [this.props.prop]: rules };
      const validator = new Schema(descriptor);

      validator.validate(model, { first: true }, (errors: any) => {
        if (errors) {
          this.setState({
            error: errors[0].message || '',
            valid: false
          });
          reject(errors);
        } else {
          this.setState({
            error: '',
            valid: true
          });
          resolve(model);
        }
      });
    });
  }

  getValueFromComponent(e: any) {
    if (!e || !e.target) {
      return e;
    }
    const { target } = e;
    return target.type === 'checkbox' ? target.checked : target.value;
  }

  handleChange = (e: any) => {
    const value = this.getValueFromComponent(e);
    this.setState({ value }, () => {
      this.validate('change');
    });
  };

  handleBlur = () => {
    this.validate('blur');
  };

  getLabelStyle() {
    const result: any = {};
    const { labelPosition } = this.props.ctx;
    const labelWidth = this.props.labelWidth || this.props.ctx.labelWidth;
    if (labelPosition === 'top') return result;

    result.textAlign = labelPosition;

    if (labelWidth) {
      result.width = labelWidth;
    }

    return result;
  }

  contentStyle() {
    const result: any = {};

    const { labelPosition } = this.props.ctx;
    const labelWidth = this.props.labelWidth || this.props.ctx.labelWidth;

    if (labelPosition === 'top') return result;

    if (labelWidth) {
      result.marginLeft = labelWidth;
    }

    return result;
  }

  componentDidMount() {
    const { prop, ctx } = this.props;
    if (prop) {
      ctx.addField(this);
    }
  }

  componentWillUnmount() {
    const { ctx } = this.props;
    ctx.removeField(this);
  }

  public render() {
    const { label, prop, ctx } = this.props;
    const { error, valid } = this.state;
    const children = this.props.children!;
    let defaultOnChange;
    const item = React.Children.map(children, (child, index) => {
      if (prop && index === 0 && React.isValidElement(child)) {
        defaultOnChange = (child.props as any).onChange;
        return React.cloneElement<any>(child, {
          value: this.state.value,
          onChange: defaultOnChange || this.handleChange
        });
      }
      return child;
    });
    const itemClasses = classNames('easy-formx-item', {
      'has-error': !valid,
      'easy-formx-item__with-help': error
    });
    const labelClasses = classNames('easy-formx-item__label', {
      'is-required': this.isRequired()
    });
    return (
      <div
        className={itemClasses}
        onBlur={this.handleBlur}
        onChange={defaultOnChange ? this.handleChange : undefined}
      >
        {label && (
          <label className={labelClasses} style={this.getLabelStyle()}>
            {label + ctx.labelSuffix}
          </label>
        )}
        <div className="easy-formx-item__content" style={this.contentStyle()}>
          {item}
          {error && <div className="easy-formx-item__error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default (props: Omit<IFormItemProps, 'ctx'>) => (
  <Consumer>{(ctx) => <FormItemComponent {...props} ctx={ctx} />}</Consumer>
);
