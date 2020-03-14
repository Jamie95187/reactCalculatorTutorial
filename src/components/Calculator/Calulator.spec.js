import React from 'react';
import { mount, shallow } from 'enzyme';
import Calculator from './Calculator';
import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';

describe('Calculator', () => {

  it('should render correctly', () => expect(wrapper).toMatchSnapshot());

  let wrapper;

  beforeEach(() => wrapper = shallow(<Calculator />));

  it('should render a <div />', () => {
    expect(wrapper.find('div').length).toEqual(1);
  });

  it('should render the Display and Keypad Components', () => {
    expect(wrapper.containsMatchingElement(
      <div>
        <Display displayValue={wrapper.instance().state.displayValue}/>
        <Keypad
          callOperator={wrapper.instance().callOperator}
          numbers={wrapper.instance().state.numbers}
          operators={wrapper.instance().state.operators}
          selectedOperator={wrapper.instance().selectedOperator}
          updateDisplay={wrapper.instance().updateDisplay}
        />
      </div>
    )).toEqual(true)
  });
});

describe('mounted Calculator', () => {
  let wrapper;

  beforeEach(() => wrapper = mount(<Calculator />));

  it('calls updateDisplay when a number key is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'updateDisplay');
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find('.number-key').first().simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls selectedOperator when a operator key is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'setOperator');
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find('.operator-key').first().simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls callOperator when the submit key is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'callOperator');
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find('.submit-key').first().simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

});

describe('updateDisplay', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Calculator />));

  it('updates displayValue', () => {
    wrapper.instance().updateDisplay('5');
    expect(wrapper.state('displayValue')).toEqual('5');
  });

  it('concatenates displayValue', () => {
    wrapper.instance().updateDisplay('5');
    wrapper.instance().updateDisplay('0');
    expect(wrapper.state('displayValue')).toEqual('50');
  });

  it('removes leading 0s from the displayValue', () => {
    wrapper.instance().updateDisplay('0');
    expect(wrapper.state('displayValue')).toEqual('0');
    wrapper.instance().updateDisplay('5');
    expect(wrapper.state('displayValue')).toEqual('5');
  });

  it('prevents multiple leading 0s from the displayValue', () => {
    wrapper.instance().updateDisplay('0');
    wrapper.instance().updateDisplay('0');
    expect(wrapper.state('displayValue')).toEqual('0');
  });

  it('removes last char of displayValue', () => {
    wrapper.instance().updateDisplay('5');
    wrapper.instance().updateDisplay('0');
    wrapper.instance().updateDisplay('ce');
    expect(wrapper.state('displayValue')).toEqual('5');
  });

  it('prevents multiple instances of "." in displayValue', () => {
    wrapper.instance().updateDisplay('.');
    wrapper.instance().updateDisplay('.');
    expect(wrapper.state('displayValue')).toEqual('.');
  });

  it('will set displayValue to "0" if displayValue is equal to an empty string', () => {
    wrapper.instance().updateDisplay('ce');
    expect(wrapper.state('displayValue')).toEqual('0');
  });

});

describe('setOperator', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Calculator />));

  it('updates the value of selectedOperator', () => {
    wrapper.instance().setOperator('+');
    expect(wrapper.state('selectedOperator')).toEqual('+');
    wrapper.instance().setOperator('/');
    expect(wrapper.state('selectedOperator')).toEqual('/');
  });

  it('updates the value of storedValue to the value of displayValue', () => {
    wrapper.setState({ displayValue: '5' });
    wrapper.instance().setOperator('+');
    expect(wrapper.state('storedValue')).toEqual('5');
  });

  it('updates the value of displayValue to 0', () => {
    wrapper.setState({ displayValue: '5' });
    wrapper.instance().setOperator('+');
    expect(wrapper.state('displayValue')).toEqual('0');
  });

  it('selectedOperator is not an empty string, does not update the storedValue', () => {
    wrapper.setState({ displayValue: '5' });
    wrapper.instance().setOperator('+');
    expect(wrapper.state('storedValue')).toEqual('5');
    wrapper.instance().setOperator('-');
    expect(wrapper.state('storedValue')).toEqual('5');
  });
});

describe('callOperator', () => {
  let wrapper;

  beforeEach(() => wrapper = shallow(<Calculator />));

  it('updates displayValue to the sum of the storedValue and displayValue', () => {
    wrapper.setState({ storedValue: '3' });
    wrapper.setState({ selectedOperator: '+' });
    wrapper.setState({ displayValue: '2' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('5');
  });

  it('updates the displayValue to the difference of the storedValue and displayValue', () => {
    wrapper.setState({ storedValue: '6' });
    wrapper.setState({ displayValue: '4' });
    wrapper.setState({ selectedOperator: '-' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('2');
  });

  it('updates the displayValue to the product of the storedValue and displayValue', () => {
    wrapper.setState({ storedValue: '3' });
    wrapper.setState({ displayValue: '4' });
    wrapper.setState({ selectedOperator: 'x' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('12');
  });

  it('updates the displayValue to the quotient of the storedValue and displayValue', () => {
    wrapper.setState({ storedValue: '3' });
    wrapper.setState({ selectedOperator: '/' });
    wrapper.setState({ displayValue: '2' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('1.5');
  });

  it('updates the displayValue to "0" if the operation is "NaN"', () => {
    wrapper.setState({ storedValue: '3' });
    wrapper.setState({ displayValue: 'string' });
    wrapper.setState({ selectedOperator: '/' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('0');
  });

  it('updates the displayValue to "0" if the operation is "Infinity"', () => {
    wrapper.setState({ storedValue: '7' });
    wrapper.setState({ displayValue: '0' });
    wrapper.setState({ selectedOperator: '/' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('0');
  });

  it('updates the displayValue to "0" if the selectedOperator does not match cases', () => {
    wrapper.setState({ storedValue: '7' });
    wrapper.setState({ displayValue: '10' });
    wrapper.setState({ selectedOperator: 'string' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('0');
  });

  it('updates the displayValue to "0" if called with no value for storedValue or selectedOperator', () => {
    wrapper.setState({ storedValue: '' });
    wrapper.setState({ displayValue: '7' });
    wrapper.setState({ selectedOperator: '' });
    wrapper.instance().callOperator();
    expect(wrapper.state('displayValue')).toEqual('0');
  });

});
