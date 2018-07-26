import React from 'react';
import PropTypes from 'prop-types';

const SubjectContext = React.createContext();

const DEFAULT_STATE = {
  isFetched: false,
  isLoading: false,
  isErased: false,
  data: null,
  status: null
};

let originalLocalStorageSetItem;
const EVENT_NAME = 'localStorage.itemInserted';
const LOCAL_STORAGE_EVENTS = [EVENT_NAME, 'storage'];

function upgradeLocalStorage() {
  if (originalLocalStorageSetItem) {
    return;
  }

  originalLocalStorageSetItem = localStorage.setItem;
  localStorage.setItem = function() {
    originalLocalStorageSetItem.apply(this, arguments);

    const keyboardEvent = new CustomEvent(EVENT_NAME);
    keyboardEvent.key = arguments[0];
    keyboardEvent.value = arguments[1];
    window.dispatchEvent(keyboardEvent);
  };
}

function downgradeLocalStorage() {
  localStorage.setItem = originalLocalStorageSetItem;
  originalLocalStorageSetItem = null;
}

export class SubjectProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  _fetchData = async () => {
    const { isLoading, isFetched, isGuest } = this.state;
    if (isLoading || isFetched || isGuest) {
      return;
    }

    this._setLoading(true);

    const cgToken = localStorage.getItem('cgToken');

    window.cg.setAccessToken(cgToken);

    let data;
    let status;

    try {
      status = await window.cg.Subject.getDataStatus();
    } catch (e) {
      status = null;
    }

    const isErased = !status || status.controller === 2;

    if (!isErased) {
      try {
        data = await window.cg.Subject.accessData();
      } catch (e) {
        data = null;
      }
    }

    this.setState({
      isLoading: false,
      isFetched: true,
      isErased,
      data,
      status
    });
  };

  _setLoading() {
    this.setState({ isLoading: true });
  }

  _localStorageEventListener(e) {
    const { key } = e;
    if (key && key !== 'cgToken') {
      return;
    }

    this.setState(this._makeNewSubjectSession());
    console.log(this.state);
  }

  _makeNewSubjectSession() {
    return {
      ...DEFAULT_STATE,
      fetchData: this._fetchData,
      isGuest: !localStorage.getItem('cgToken')
    };
  }

  constructor(props) {
    super(props);
    this.state = this._makeNewSubjectSession();
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
      {subject => React.createElement(component, { ...props, subject })}
    </SubjectContext.Consumer>
  );
};
