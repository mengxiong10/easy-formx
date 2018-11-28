import { Form, FormItem } from '../src/index';
import { Input, Radio, Button, notification, InputNumber } from 'antd';
import * as React from 'react';

interface IState {
  position: 'left' | 'right' | 'top';
}

export default class Basic extends React.Component<any, IState> {
  formRef: Form;

  rules = {
    name: [{ required: true, message: 'required', trigger: 'blur' }],
    description: [{ required: true, message: 'required', trigger: 'blur' }]
  };

  state: IState = {
    position: 'right'
  };

  handleChange = (e: any) => {
    this.setState({
      position: e.target.value
    });
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.formRef.validate().then((result) => {
      notification.open({
        message: 'Result',
        description: <pre>{JSON.stringify(result, null, 2)}</pre>
      });
    });
  };
  handleReset = () => {
    this.formRef.resetFields();
  };

  render() {
    return (
      <div>
        <Radio.Group
          value={this.state.position}
          onChange={this.handleChange}
          buttonStyle="solid"
          style={{
            marginBottom: 15
          }}
        >
          <Radio.Button value="left">left</Radio.Button>
          <Radio.Button value="right">right</Radio.Button>
          <Radio.Button value="top">top</Radio.Button>
        </Radio.Group>
        <Form
          ref={(ref) => (this.formRef = ref)}
          labelWidth="100px"
          labelPosition={this.state.position}
          rules={this.rules}
          onSubmit={this.handleSubmit}
        >
          <FormItem label="Name" prop="name">
            <Input />
          </FormItem>
          <FormItem label="Description" prop="description">
            <Input />
          </FormItem>
          <FormItem label="Number" prop="number" initialValue={10}>
            <InputNumber />
            <span style={{ marginLeft: 10 }}>(tip)</span>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              submit
            </Button>
            <Button onClick={this.handleReset} style={{ marginLeft: 10 }}>
              reset
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
