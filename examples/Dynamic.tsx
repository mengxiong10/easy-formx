import { Form, FormItem } from '../src/index';
import { Input, Button, notification, Icon } from 'antd';
import * as React from 'react';

interface IState {
  keys: number[];
}

export default class Basic extends React.Component<any, IState> {
  formRef: Form;

  state = {
    keys: [0, 1, 2]
  };

  id = Math.max(...this.state.keys);

  add = () => {
    this.setState((prevState) => ({
      keys: prevState.keys.concat(++this.id)
    }));
  };

  remove = (key) => {
    this.setState((prevState) => ({
      keys: prevState.keys.filter((v) => v !== key)
    }));
  };

  setValues = () => {
    this.formRef.setFieldsValue({
      values: [0, 1, 3]
    });
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.formRef.validate().then((result: any) => {
      // filter the empty element
      result.values = result.values.filter(() => true);
      notification.open({
        message: 'Result',
        description: <pre>{JSON.stringify(result, null, 2)}</pre>
      });
    });
  };

  render() {
    const { keys } = this.state;
    const items = keys.map((key, i) => (
      <FormItem key={key} prop={`values[${key}]`}>
        <Input style={{ width: '60%', marginRight: 8 }} />
        {keys.length > 1 ? (
          <Icon
            style={{ fontSize: 18, verticalAlign: 'middle', cursor: 'pointer' }}
            type="minus-circle-o"
            onClick={() => this.remove(key)}
          />
        ) : null}
      </FormItem>
    ));
    return (
      <div>
        <Form ref={(ref) => (this.formRef = ref)} onSubmit={this.handleSubmit}>
          {items}
          <FormItem>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add field
            </Button>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              submit
            </Button>
            <Button style={{ marginLeft: 10 }} onClick={this.setValues}>
              set
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
