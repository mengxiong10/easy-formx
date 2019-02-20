import React, { useState } from 'react';
import { useFormx, Formx, FormxItem } from '../src';
import { Input, Button, Icon } from 'antd';
import { DisplayState } from './helper';

export default function Dynamic() {
  const fields = ['test1', 'test2'];

  const { bindFormx, value } = useFormx({
    fields
  });

  const [keys, setKeys] = useState(fields.map((_, i) => i));

  const add = () => {
    setKeys(keys.concat(keys[keys.length - 1] + 1));
  };

  const remove = (key) => {
    setKeys(keys.filter((v) => v !== key));
  };

  const items = keys.map((key, i) => (
    <FormxItem {...bindFormx(`fields[${key}]`)}>
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
      <DisplayState {...value} />
    </div>
  );
}
