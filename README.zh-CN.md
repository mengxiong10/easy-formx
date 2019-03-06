# easy-formx

[English](https://github.com/mengxiong10/easy-formx/blob/master/README.md)

> 一个非常简单的 React 表单配合 hooks 的组件, 可以用于替换 `antd`的 Form 组件.

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

## 线上 Demo

<https://mengxiong10.github.io/easy-formx/example.html>

## 安装

```bash
$ npm install easy-formx --save
```

## 用法

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

#### value

当前表单组件的值

#### bindFormx

接受需要绑定的表单的属性返回的对象设置到`FormxItem`.
第一个子组件会自动添加`value`(或者由`valuePropName`定义的属性) 和 `onChange`(或者由`trigger`定义的属性);

```jsx
<FormxItem label="name" {...bindFormx('name')}>
  <input type="text" />
</FormxItem>
```

#### setFieldsValue

设置一组表单值

```js
setFieldsValue({ name: 'name', age: 'age' });
```

#### setFieldsError

设置一组表单的错误信息

```js
setFieldsError({ name: new Error('required') });
```

#### validate

校验表单,返回 Promise

```js
validate().then();
```

#### getField

获取一个表单控件的值和错误

```js
// basic
const [value, error] = getField('name');

// 如果有比较重的组件可以用`useMemo`,只在绑定的值变化的时候重新渲染
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

| 属性          | 描述              | 类型                       | 默认值  |
| ------------- | ----------------- | -------------------------- | ------- |
| labelPosition | 所有 label 的位置 | 'right' \| 'left' \| 'top' | 'right' |
| labelWidth    | 所有 label 的宽度 | string\|number             | -       |
| labelSuffix   | 所有 label 的后缀 | `string`                   | ':'     |

### FormxItem

| 属性          | 描述                     | 类型     | 默认值     |
| ------------- | ------------------------ | -------- | ---------- |
| label         | label 标签的文本         | `string` | -          |
| labelStyle    | label 标签的自定义 style | `object` | -          |
| trigger       | 触发子节点值修改的方法   | `string` | 'onChange' |
| valuePropName | 子节点的值的属性         | `string` | 'value'    |

## License

[MIT](https://github.com/mengxiong10/easy-formx/blob/master/LICENSE)

Copyright (c) 2019-present xiemengxiong
