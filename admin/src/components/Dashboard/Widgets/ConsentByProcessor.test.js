import React from 'react';
import { shallow } from 'enzyme';
import ConsentByProcessor from './ConsentByProcessor';
import toJson from 'enzyme-to-json';
import ItemsCard from 'components/core/cards/dashboard/ItemsCard';

describe('(Component) ConsentByProcessor', () => {
  it('should render', () => {
    const props = {
      totalSubjects: 100,
      processors: [
        {
          name: 'p1',
          consented: 1
        }
      ]
    };
    const component = shallow(<ConsentByProcessor {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render if numbers are 0', () => {
    const props = {
      totalSubjects: 100,
      processors: [
        {
          name: 'p1',
          consented: 1
        }
      ]
    };
    const component = shallow(<ConsentByProcessor {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should do the math correctly', () => {
    const props = {
      totalSubjects: 100,
      processors: [
        {
          name: 'p1',
          consented: 32
        }
      ]
    };
    const component = shallow(<ConsentByProcessor {...props} />);
    expect(component.find(ItemsCard).props().data[0].fillPercent).toEqual(32);
    expect(toJson(component)).toMatchSnapshot();
  });
});
