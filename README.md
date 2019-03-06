# easy-formx

[中文版](https://github.com/mengxiong10/easy-formx/blob/master/README.zh-CN.md)

> a very easy react hooks form component. can replace the antd form component.

<a href="https://travis-ci.org/mengxiong10/easy-formx">
  <img src="https://travis-ci.org/mengxiong10/easy-formx.svg?branch=master" alt="build:passed">
</a>
<a href="https://coveralls.io/github/mengxiong10/easy-formx">
  <img src="https://coveralls.io/repos/github/mengxiong10/easy-formx/badge.svg?branch=master&service=github" alt="Badge">
</a>
<a href="https://www.npmjs.com/package/easy-formx">
  <img src="https://img.shields.io/npm/v/easy-formx.svg" alt="npm">
</a>
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT">
</a>

## Demo

<https://mengxiong10.github.io/easy-formx/example.html>

## Install

```bash
$ npm install easy-formx --save
```

## Usage

```jsx
import { useFormx, Formx, FormxItem } from 'easy-formx';
import 'easy-formx/dist/index.css';

const rules = {
  name: { required: true, message: 'required', trigger: 'blur' },
  description: { required: true, message: 'required', trigger: 'blur' }
};

const initialValue = {
  name: 'easy-formx',
  description: 'a very easy react hooks form component'
};

export default function Basic() {
  const { bindFormx, value, validate } = useFormx(initialValue, rules);

  const submit = () => {
    validate().then((data) => {
      console.log(data);
    });
  };

  return (
    <Formx labelWidth="100px">
      <FormxItem label="Name" {...bindFormx('name')}>
        <Input />
      </FormxItem>
      <FormxItem label="Description" {...bindFormx('description')}>
        <Input />
      </FormxItem>
      <FormxItem>
        <Button type="primary" onClick={submit}>
          submit
        </Button>
      </FormxItem>
    </Formx>
  );
}
```

## API

### useFormx

```js
const { bindFormx, value, validate, setFieldsValue, setFieldsError, getField } = useFormx(
  initialValue
);
```

#### bindFormx

A function that returns the appropriate props that can be spread on the `FormxItem`.

After bind `FormxItem` by bindFormx, value(or other property defined by valuePropName) onChange(or other property defined by trigger) props will be added to first child comoponent.

```jsx
<FormxItem label="name" {...bindFormx('name')}>
  <input type="text" />
</FormxItem>
```

#### setFieldsValue

Set the value of fields

```js
setFieldsValue({ name: 'name', age: 'age' });
```

#### setFieldsError

Set the error of fields

```js
setFieldsError({ name: new Error('required') });
```

#### validate

validate all fields, return promise

```js
validate().then();
```

#### getField

get the binding field value and error;

```js
// basic
const [value, error] = getField('name');

// just update the wrapper compoennt when the bindingValue changed
const expensiveItem = useMemo(
  () => (
    <FormxItem label="name" {...bindFormx('name')}>
      <ExpensiveComponent />
    </FormxItem>
  ),
  getField('name')
);
```

### Formx

| Prop          | Description       | Type                       | Default |
| ------------- | ----------------- | -------------------------- | ------- |
| labelPosition | position of label | 'right' \| 'left' \| 'top' | 'right' |
| labelWidth    | width of label    | string\|number             | -       |
| labelSuffix   | suffix of label   | `string`                   | ':'     |

### FormxItem

| Prop          | Description                               | Type     | Default    |
| ------------- | ----------------------------------------- | -------- | ---------- |
| label         | The label text                            | `string` | -          |
| labelStyle    | The label style                           | `object` | -          |
| trigger       | prop of listen children node value change | `string` | 'onChange' |
| valuePropName | prop of children node value               | `string` | 'value'    |

## License

[MIT](https://github.com/mengxiong10/easy-formx/blob/master/LICENSE)

Copyright (c) 2018-present xiemengxiong
