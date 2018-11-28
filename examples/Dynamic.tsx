import { Form, FormItem } from '../src/index';
import { Input, Button, notification, Icon } from 'antd';
import * as React from 'react';

interface IState {
  keys: number[];
}

export default class Basic extends React.Component<any, IState> {
  formRef: Form;

  id = 0;

  state = {
    keys: []
  };

  add = () => {
    this.setState((prevState) => ({
      keys: prevState.keys.concat(++this.id)
    }));
  };

  remove = () => {};

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.formRef.validate().then((result) => {
      notification.open({
        message: 'Result',
        description: <pre>{JSON.stringify(result, null, 2)}</pre>
      });
    });
  };

  render() {
    return (
      <div>
        <Form ref={(ref) => (this.formRef = ref)} onSubmit={this.handleSubmit}>
          <FormItem>
            <Button type="dashed" onClick={this.add}>
              <Icon type="plus" /> Add field
            </Button>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
