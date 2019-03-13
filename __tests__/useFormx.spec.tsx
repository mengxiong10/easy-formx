import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Formx, FormxItem, useFormx } from '../src';

describe('useFormx', () => {
  it('should auto collect value, support nested field, like a[0], a.b', () => {
    const beforeValue = {
      desc: 'beforeDesc',
      name: {
        first: 'beforeFirst',
        last: 'beforeLast'
      },
      arr: [0]
    };
    const Test = () => {
      const { bindFormx, value } = useFormx(beforeValue);
      return (
        <div>
          <Formx>
            <FormxItem {...bindFormx('desc')}>
              <input type="text" />
            </FormxItem>
            <FormxItem {...bindFormx('name.first')}>
              <input type="text" />
            </FormxItem>
            <FormxItem {...bindFormx('name.last')}>
              <input type="text" />
            </FormxItem>
            <FormxItem {...bindFormx('arr[0]')}>
              <input type="number" />
            </FormxItem>
          </Formx>
          <div id="value">{JSON.stringify(value)}</div>
        </div>
      );
    };
    const wrapper = mount(<Test />);
    const getInput = (i: number) => wrapper.find('input').at(i);
    expect(getInput(0).props().value).toBe(beforeValue.desc);
    expect(getInput(1).props().value).toBe(beforeValue.name.first);
    expect(getInput(2).props().value).toBe(beforeValue.name.last);
    expect(getInput(3).props().value).toBe(beforeValue.arr[0]);
    expect(wrapper.find('#value').text()).toBe(JSON.stringify(beforeValue));

    const after = ['afterDesc', 'afterFirst', 'afterLast', 1];
    after.forEach((v, i) => {
      getInput(i).simulate('change', { target: { value: v } });
      expect(getInput(i).props().value).toBe(v);
    });
    expect(wrapper.find('#value').text()).toBe(
      JSON.stringify({
        desc: after[0],
        name: {
          first: after[1],
          last: after[2]
        },
        arr: [after[3]]
      })
    );
    // beforeValue should be immutable
    expect(beforeValue).toEqual({
      desc: 'beforeDesc',
      name: {
        first: 'beforeFirst',
        last: 'beforeLast'
      },
      arr: [0]
    });
  });

  it('should auto validate', (done) => {
    const Test = () => {
      const data = { name: '1' };
      const rules = {
        name: { required: true, message: 'required', trigger: 'change' }
      };
      const { bindFormx } = useFormx(data, rules);
      return (
        <Formx>
          <FormxItem {...bindFormx('name')}>
            <input type="text" />
          </FormxItem>
        </Formx>
      );
    };
    const wrapper = mount(<Test />);
    wrapper.find('input').simulate('change', { target: { value: '' } });
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.find('.easy-formx-item__error').text()).toBe('required');
      done();
    });
  });

  it('should trigger original change event', () => {
    jest.useFakeTimers();
    const spy = sinon.spy();
    const Test = () => {
      const data = { name: 'before' };
      const { bindFormx } = useFormx(data);
      return (
        <Formx>
          <FormxItem {...bindFormx('name')}>
            <input type="text" onChange={spy} />
          </FormxItem>
        </Formx>
      );
    };
    const wrapper = mount(<Test />);
    wrapper.find('input').simulate('change');
    jest.runAllTimers();
    expect(spy.calledOnce).toBe(true);
  });

  it('setFieldsValue', () => {
    const Test = () => {
      const data = { name: 'before' };
      const { bindFormx, setFieldsValue } = useFormx(data);
      return (
        <Formx>
          <FormxItem {...bindFormx('name')}>
            <input type="text" />
          </FormxItem>
          <button
            onClick={() => {
              setFieldsValue({ name: 'after' });
            }}
          >
            set
          </button>
        </Formx>
      );
    };
    const wrapper = mount(<Test />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('input').props().value).toBe('after');
  });

  it('setFieldsError', () => {
    const Test = () => {
      const data = { name: 'before' };
      const { bindFormx, setFieldsError } = useFormx(data);
      return (
        <Formx>
          <FormxItem {...bindFormx('name')}>
            <input type="text" />
          </FormxItem>
          <button
            onClick={() => {
              setFieldsError({ name: new Error('required') });
            }}
          >
            set
          </button>
        </Formx>
      );
    };
    const wrapper = mount(<Test />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('.easy-formx-item__error').text()).toBe('required');
  });
});
