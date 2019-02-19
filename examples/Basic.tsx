import { useFormx, Formx, FormxItem } from '../src';
import { Input, Radio, Button, InputNumber } from 'antd';
import { DisplayState } from './helper';
import * as React from 'react';

const rules = {
  name: { required: true, message: 'required', trigger: 'blur' },
  description: { required: true, message: 'required', trigger: 'blur' }
};

const initialValue = { name: 'name', description: 'description', number: 22 };

export default function Basic() {
  const [position, setPosition] = React.useState<'left' | 'right' | 'top'>('right');

  const { bindFormx, value, validate } = useFormx<typeof initialValue>(initialValue, rules);

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
      <Formx labelWidth="100px" labelPosition={position}>
        <FormxItem label="Name" {...bindFormx('name')}>
          <Input />
        </FormxItem>
        <FormxItem label="Description" {...bindFormx('description')}>
          <Input />
        </FormxItem>
        <FormxItem label="Number" {...bindFormx('number')}>
          <InputNumber min={0} max={100} />
          <span style={{ marginLeft: 10 }}>(min: 0, max: 100)</span>
        </FormxItem>
        <FormxItem>
          <Button type="primary" onClick={submit}>
            submit
          </Button>
        </FormxItem>
      </Formx>
      <DisplayState {...value} />
    </div>
  );
}
