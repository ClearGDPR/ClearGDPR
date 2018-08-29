import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { CG } from '@cleargdpr/js-sdk';
import Subject from './Subject';

const cg = new CG({ apiKey: config.CG_API_KEY, apiUrl: `${config.CG_API_BASE}/api` });
cg.setAccessToken(localStorage.getItem('cgToken'));

const SubjectContext = React.createContext();

const DEFAULT_STATE = {
  isFetched: false,
  isLoading: false,
  isErased: false,
  data: null,
  status: null,
  processors: null,
  objection: null,
  shares: null,
  restrictions: null
};

let originalLocalStorageSetItem;
const EVENT_NAME = 'localStorage.itemInserted';
const LOCAL_STORAGE_EVENTS = [EVENT_NAME, 'storage'];

const upgradeLocalStorage = function() {
  if (originalLocalStorageSetItem) {
    return;
  }

  originalLocalStorageSetItem = localStorage.setItem;
  localStorage.setItem = function() {
    originalLocalStorageSetItem.apply(this, arguments);

    const event = new CustomEvent(EVENT_NAME);
    event.key = arguments[0];
    event.value = arguments[1];
    window.dispatchEvent(event);
  };
};

const downgradeLocalStorage = function() {
  localStorage.setItem = originalLocalStorageSetItem;
  originalLocalStorageSetItem = null;
};

export class SubjectProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  _localStorageEventListener(e) {
    const { key } = e;
    if (key && key !== 'cgToken') {
      return;
    }

    cg.setAccessToken(localStorage.getItem('cgToken'));
    this._initNewSession();
  }

  _initNewSession = () => {
    this.setState({ subject: new Subject(cg, this._makeNewSubjectSession()) });
  };

  _makeNewSubjectSession() {
    return {
      ...DEFAULT_STATE,
      isGuest: !localStorage.getItem('cgToken'),
      propagateMutation: subject => {
        this.setState({ subject });
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = { subject: new Subject(cg, this._makeNewSubjectSession()) };
    this._localStorageEventListener = this._localStorageEventListener.bind(this);
  }

  componentDidMount() {
    upgradeLocalStorage();
    LOCAL_STORAGE_EVENTS.map(name =>
      window.addEventListener(name, this._localStorageEventListener)
    );
  }

  componentWillUnmount() {
    LOCAL_STORAGE_EVENTS.map(name =>
      window.removeEventListener(name, this._localStorageEventListener)
    );
    downgradeLocalStorage();
  }

  render() {
    return (
      <SubjectContext.Provider value={this.state}>{this.props.children}</SubjectContext.Provider>
    );
  }
}

export const inject = component => {
  return props => (
    <SubjectContext.Consumer>
      {context => React.createElement(component, { ...props, subject: context.subject })}
    </SubjectContext.Consumer>
  );
};
