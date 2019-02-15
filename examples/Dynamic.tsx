import { useForm, FormProvider, FormItem } from '../src';
import { Input, Button, Icon } from 'antd';
import * as React from 'react';

export default function Dynamic() {
  const [keys, setKeys] = React.useState([0]);
  const formValue = useForm({
    initialData: {
      values: [10]
    },
    labelWidth: '100px',
    labelPosition: 'right'
  });

  const add = () => {
    setKeys(keys.concat(keys[keys.length - 1] + 1));
  };

  const remove = (key) => {
    setKeys(keys.filter((v) => v !== key));
  };

  const items = keys.map((key, i) => (
    <FormItem key={key} prop={`values[${key}]`}>
      <Input style={{ width: '60%', marginRight: 8 }} />
      {keys.length > 1 ? (
        <Icon
          style={{ fontSize: 18, verticalAlign: 'middle', cursor: 'pointer' }}
          type="minus-circle-o"
          onClick={() => remove(key)}
        />
      ) : null}
    </FormItem>
  ));
  return (
    <FormProvider value={formValue}>
      {items}
      <FormItem>
        <Button type="dashed" onClick={add}>
          <Icon type="plus" /> Add field
        </Button>
      </FormItem>
    </FormProvider>
  );
}
