import React, { useState } from 'react';
import { Input, Button, Icon } from 'antd';
import { DisplayState } from './helper';
import { useFormx, Formx, FormxItem } from '../src/index';
import '../src/index.scss';

const initialValue = {
  fields: [{ key: 0, text: 't1' }]
};

export default function Dynamic() {
  const { bindFormx, value, setFieldsValue } = useFormx(initialValue);

  const add = () => {
    const keys = value.fields.map((v) => v.key);
    const maxKey = keys.length ? Math.max(...keys) : 0;
    const fields = value.fields.slice();
    fields.push({ key: maxKey + 1, text: '' });
    setFieldsValue({ fields });
  };

  const remove = (i) => {
    const fields = value.fields.slice();
    fields.splice(i, 1);
    setFieldsValue({ fields });
  };

  const items = value.fields.map((item, i) => (
    <FormxItem {...bindFormx(`fields[${i}].text`)} key={item.key}>
      <Input style={{ width: '60%', marginRight: 8 }} />
      {value.fields.length > 1 ? (
        <Icon
          style={{ fontSize: 18, verticalAlign: 'middle', cursor: 'pointer' }}
          type="minus-circle-o"
          onClick={() => remove(i)}
        />
      ) : null}
    </FormxItem>
  ));

  const displayValue = {
    fields: value.fields.map((v) => v.text)
  };

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
      <DisplayState {...displayValue} />
    </div>
  );
}
