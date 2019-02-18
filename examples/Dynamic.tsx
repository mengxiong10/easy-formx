import { useFormx, Formx, FormxItem } from '../src';
import { Input, Button, Icon } from 'antd';
import * as React from 'react';
import { DisplayState } from './helper';

export default function Dynamic() {
  const values = ['test1', 'test2'];

  const { bindFormx, data } = useFormx({
    values
  });

  const [keys, setKeys] = React.useState(values.map((_, i) => i));

  const add = () => {
    setKeys(keys.concat(keys[keys.length - 1] + 1));
  };

  const remove = (key) => {
    setKeys(keys.filter((v) => v !== key));
  };

  const items = keys.map((key, i) => (
    <FormxItem {...bindFormx(`values[${key}]`)}>
      <Input style={{ width: '60%', marginRight: 8 }} />
      {keys.length > 1 ? (
        <Icon
          style={{ fontSize: 18, verticalAlign: 'middle', cursor: 'pointer' }}
          type="minus-circle-o"
          onClick={() => remove(key)}
        />
      ) : null}
    </FormxItem>
  ));
  return (
    <div>
      <Formx>
        {items}
        <FormxItem>
          <Button type="dashed" onClick={add}>
            <Icon type="plus" /> Add field
          </Button>
        </FormxItem>
      </Formx>
      <DisplayState {...data} />
    </div>
  );
}
