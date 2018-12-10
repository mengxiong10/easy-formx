# easy-formx

[中文版](https://github.com/mengxiong10/easy-formx/blob/master/README.zh-CN.md)

> a very easy react form component.

<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT">
</a>

## Demo

<https://mengxiong10.github.io/easy-formx/demo/index.html>

## Install

```bash
$ npm install easy-formx --save
```

### Form Props

| Prop          | Type           | Default | Description                                 |
| ------------- | -------------- | ------- | ------------------------------------------- |
| labelPosition | string         | 'right' | position of label(left/right/top)           |
| labelWidth    | string\|number | -       | all Form items width will inherit from this |
| labelSuffix   | string         | ':'     | suffix of the label                         |
| rules         | object         | -       | validation rules of form                    |

### Form Methods

<!-- prettier-ignore-start -->

| Method   | Description         | Type                                  |
| -------- | ------------------- | ------------------------------------- |
| validate | validate all fields | () => Promise<{\[fieldName\] : any }> |
| getFieldsValue | Get the specified fields' values.If you don't specify a parameter, you will get all fields' value | (fieldNames?: string[]) => {\[fieldName\]: any}|
| setFieldsValue | Set the specified fields' values. | (obj: { [fieldName: string]: any }) => void |
| resetFields | Reset the specified fields' values.If you don't specify a parameter, all the fields will be reset |

<!-- prettier-ignore-end -->

### FormItem Props

| Prop          | Type           | Default    | Description                                                                             |
| ------------- | -------------- | ---------- | --------------------------------------------------------------------------------------- |
| prop          | string         | -          | Two-way binding for the form, the unique field name,support nested value(a.b \| a\[0\]) |
| initialValue  | any            | ''         | The form item initialValue and the reset value                                          |
| label         | string         | -          | The label text                                                                          |
| rules         | object[]       | -          | Validation rules of form item                                                           |
| labelWidth    | string\|number | -          | The label width                                                                         |
| required      | boolean        | false      | A quick way to set rules([{ required: true, message: 'required', trigger: 'blur' }])    |
| trigger       | string         | 'onChange' | When to collect the value of children node                                              |
| valuePropName | string         | 'value'    | children node value prop.                                                               |

## License

[MIT](https://github.com/mengxiong10/easy-formx/blob/master/LICENSE)

Copyright (c) 2018-present xiemengxiong
