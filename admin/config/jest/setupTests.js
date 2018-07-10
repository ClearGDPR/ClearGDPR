import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

console.error = jest.fn();

configure({ adapter: new Adapter() });

