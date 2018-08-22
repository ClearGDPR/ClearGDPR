import React from 'react';
import { shallow, mount } from 'enzyme';

import Details from './Details';

const basicRectification = {
  id: 1,
  currentData: {
    firstName: 'Johnny',
    email: 'jb@coolcartoons.io',
    someKey: 'Some data goes here'
  },
  updates: {
    lastName: 'Bravo'
  },
  createdAt: '2018-07-10T16:14:20.742Z',
  status: 'PENDING'
};

const nestedRectification = {
  id: 2,
  currentData: {
    firstName: 'Johnny',
    email: 'jb@coolcartoons.io'
  },
  updates: {
    lastName: 'Bravo',
    someKey: 'Some data goes here',
    specifics: {
      hairStyle: 'fashionable',
      favoriteColor: 'black',
      moreSpecifics: {
        quote: "Man, I'm pretty."
      }
    }
  },
  createdAt: '2018-07-10T16:14:20.742Z',
  status: 'APPROVED'
};

const nestedRectificationWithArray = {
  id: 2,
  currentData: {
    firstName: 'Johnny',
    email: 'jb@coolcartoons.io',
    someArray: [1, 2, 'three']
  },
  updates: {
    lastName: 'Bravo',
    someKey: 'Some data goes here',
    specifics: {
      hairStyle: 'fashionable',
      favoriteColor: 'black',
      moreSpecifics: {
        quote: "Man, I'm pretty."
      },
      wardrobe: ['jeans', 't-shirt']
    }
  },
  createdAt: '2018-07-10T16:14:20.742Z',
  status: 'APPROVED'
};

const setup = propOverrides => {
  const props = Object.assign(
    {
      rectification: basicRectification,
      onApprove: jest.fn(),
      isLoading: false
    },
    propOverrides
  );
  const component = shallow(<Details {...props} />);
  const mounted = mount(<Details {...props} />);

  return { props, component, mounted };
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('(Component) Rectification details', () => {
  it('should render when not loading correctly', () => {
    const { component } = setup();
    expect(component).toMatchSnapshot();
  });

  it('should render when loading correctly', () => {
    const component = setup({ isLoading: true });
    expect(component).toMatchSnapshot();
  });

  it('should render nested properties correctly', () => {
    const { component, mounted } = setup({ rectification: nestedRectification });
    expect(component).toMatchSnapshot();

    const button = mounted.find('button').at(0);
    expect(button.exists()).toBe(false);
  });

  it('should render array values in properties correctly', () => {
    const { component } = setup({ rectification: nestedRectificationWithArray });
    expect(component).toMatchSnapshot();
  });

  it('should call onApproved on click of Approve button', () => {
    const { props, mounted } = setup();
    const button = mounted.find('button').at(0);
    button.simulate('click');

    expect(props.onApprove).toHaveBeenCalled();
  });
});
