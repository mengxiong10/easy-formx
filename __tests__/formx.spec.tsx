import React from 'react';
import { mount } from 'enzyme';
import { Formx, FormxItem } from '../src';

const labelClass = '.easy-formx-item__label';
const contentClass = '.easy-formx-item__content';
const suffixClass = '.esay-formx-item__suffix';

describe('Formx', () => {
  it('prop labelPosition', () => {
    const wrapper = mount(
      <Formx>
        <FormxItem label="name">
          <input type="text" />
        </FormxItem>
      </Formx>
    );
    const getLabelStyle = () =>
      wrapper
        .find(labelClass)
        .at(0)
        .props().style;

    expect(getLabelStyle()).toHaveProperty('textAlign', 'right');

    wrapper.setProps({ labelPosition: 'left' });
    expect(getLabelStyle()).toHaveProperty('textAlign', 'left');

    wrapper.setProps({ labelPosition: 'top' });
    expect(getLabelStyle()).not.toHaveProperty('textAlign');
  });

  it('prop labelWidth', () => {
    const labelWidth = 200;
    const wrapper = mount(
      <Formx labelWidth={labelWidth}>
        <FormxItem label="name">
          <input type="text" />
        </FormxItem>
      </Formx>
    );
    expect(
      wrapper
        .find(labelClass)
        .at(0)
        .props().style
    ).toHaveProperty('width', labelWidth);
    expect(
      wrapper
        .find(contentClass)
        .at(0)
        .props().style
    ).toHaveProperty('marginLeft', labelWidth);
  });

  it('prop labelSuffix', () => {
    const wrapper = mount(
      <Formx>
        <FormxItem label="name">
          <input type="text" />
        </FormxItem>
      </Formx>
    );
    expect(
      wrapper
        .find(suffixClass)
        .at(0)
        .text()
    ).toBe(':');

    wrapper.setProps({ labelSuffix: '' });
    expect(
      wrapper
        .find(suffixClass)
        .at(0)
        .text()
    ).toBe('');
  });
});

describe('FormxItem', () => {
  it('prop label', async () => {
    const wrapper = mount(<FormxItem />);
    // should not render label when label is undefined
    expect(wrapper.exists(labelClass)).toBe(false);

    wrapper.setProps({ label: 'test' });
    expect(wrapper.find(labelClass).text()).toBe('test:');
  });
});
