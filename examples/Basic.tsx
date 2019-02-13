import { useForm, FormProvider, FormItem } from '../src';
import { Input, Radio, Button, InputNumber } from 'antd';
import * as React from 'react';

export default function Basic() {
  const rules = {
    name: { required: true, message: 'required', trigger: 'blur' },
    description: { required: true, message: 'required', trigger: 'blur' }
  };

  const [position, setPosition] = React.useState('right');

  const initialState = { name: 'ok', description: 'haha' };

  const formValue = useForm({
    initialState,
    labelWidth: '100px',
    labelPosition: position as 'left' | 'right' | 'top',
    rules
  });

  const { validate } = formValue;

  const handleChange = (e: any) => {
    setPosition(e.target.value);
  };

  const submit = () => {
    validate().then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <Radio.Group
        value={position}
        onChange={handleChange}
        buttonStyle="solid"
        style={{
          marginBottom: 15
        }}
      >
        <Radio.Button value="left">left</Radio.Button>
        <Radio.Button value="right">right</Radio.Button>
        <Radio.Button value="top">top</Radio.Button>
      </Radio.Group>
      <FormProvider value={formValue}>
        <FormItem label="Name" prop="name">
          <Input />
        </FormItem>
        <FormItem label="Description" prop="description">
          <Input />
        </FormItem>
        <FormItem label="Number" prop="number">
          <InputNumber />
          <span style={{ marginLeft: 10 }}>(tip)</span>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={submit}>
            submit
          </Button>
        </FormItem>
      </FormProvider>
    </div>
  );
}
