import * as React from 'react';
import { mount } from 'enzyme';
import Form from '../src/Form';

const FormItem = Form.Item;

let wrapper: any;

afterEach(() => {
  wrapper.unmount();
});

describe('<Form></Form>', () => {
  it('prop labelWidth', () => {
    wrapper = mount(
      <Form labelWidth="100px">
        <FormItem label="Name" prop="name">
          <input />
        </FormItem>
      </Form>
    );
    const contentStyle = wrapper.find('.easy-formx-item__content').get(0).props.style;
    expect(contentStyle).toHaveProperty('marginLeft', '100px');
  });
});
