import React from 'react';
import PropTypes from 'prop-types';

const SubjectContext = React.createContext();

export class SubjectProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  fetchData = async () => {
    const { isLoading, isFetched, isGuest } = this.state;
    if (isLoading || isFetched || isGuest) {
      return;
    }

    this.setLoading(true);

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

  setLoading() {
    this.setState({ isLoading: true });
  }

  state = {
    isGuest: !localStorage.getItem('cgToken'),
    fetchData: this.fetchData,
    isLoading: false,
    isFetched: false,
    isErased: false,
    data: null,
    status: null
  };

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
