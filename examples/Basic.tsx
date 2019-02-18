import { useFormx, Formx, FormxItem } from '../src';
import { Input, Radio, Button, InputNumber } from 'antd';
import { DisplayState } from './helper';
import * as React from 'react';

export default function Basic() {
  const rules = {
    name: { required: true, message: 'required', trigger: 'blur' },
    description: { required: true, message: 'required', trigger: 'blur' }
  };

  const [position, setPosition] = React.useState<'left' | 'right' | 'top'>('right');

  const initialData = { name: 'ok', description: 'haha', number: 2 };

  const { bindFormx, data, validate } = useFormx(initialData);

  const handleChange = (e: any) => {
    setPosition(e.target.value);
  };

  const submit = () => {
    validate(rules).then((res) => {
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
          <InputNumber min={0} max={10} />
          <span style={{ marginLeft: 10 }}>(min: 0, max: 10)</span>
        </FormxItem>
        <FormxItem>
          <Button type="primary" onClick={submit}>
            submit
          </Button>
        </FormxItem>
      </Formx>
      <DisplayState {...data} />
    </div>
  );
}
