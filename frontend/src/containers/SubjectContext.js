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
    const { isLoading, isFetched } = this.state;
    if (isLoading || isFetched) {
      return;
    }

    this.setLoading(true);

    const cgToken = localStorage.getItem('cgToken');

    window.cg.setAccessToken(cgToken);

    let data;
    let dataStatus;

    try {
      dataStatus = await window.cg.Subject.getDataStatus();
    } catch (e) {
      dataStatus = null;
    }

    const isErased = !dataStatus || dataStatus.controller === 2;

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
      data
    });
  };

  setLoading() {
    this.setState({ isLoading: true });
  }

  state = {
    fetchData: this.fetchData,
    isLoading: false,
    isFetched: false,
    data: null,
    isErased: false
  };

  render() {
    return (
      <SubjectContext.Provider value={this.state}>{this.props.children}</SubjectContext.Provider>
    );
  }
}

export const SubjectConsumer = SubjectContext.Consumer;
