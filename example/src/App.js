import React, { Component } from 'react'
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import 'antd/lib/input/style/index.css'
import 'antd/lib/button/style/index.css'

import Form from 'react-form'

const FormItem = Form.Item;

export default class App extends Component {
  render () {
    return (
      <section style={{ width: 500 }}>
        <Form labelWidth="80px">
          <FormItem
            label="名字"
            prop="name"
            rules={{ required: true, message: '名字不能为空' }}
          >
            <Input />
          </FormItem>
          <FormItem
            label="描述"
            prop="description"
            rules={{ required: true, message: '描述不能为空' }}
          >
            <Input />
          </FormItem>
        </Form>
      </section>
    )
  }
}
