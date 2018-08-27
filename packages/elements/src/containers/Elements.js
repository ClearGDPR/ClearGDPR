import React from 'react';
import PropTypes from 'prop-types';
import Subject from '../contexts/Subject';
import { inject } from '../contexts/SubjectContext';

class ElementsContainer extends React.Component {
  componentDidMount() {
    this.props.subject.fetchData();
  }

  render() {
    const { subject } = this.props;

    if (!subject.isFetched) {
      return <span>Loading....</span>;
    }

    return (
      <React.Fragment>
        {this.props.children}
        Hello Elements!
      </React.Fragment>
    );
  }
}

ElementsContainer.propTypes = {
  subject: PropTypes.instanceOf(Subject),
  history: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default inject(ElementsContainer);
