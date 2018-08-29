import React from 'react';
import LoadingScreen from '../components/LoadingScreen';
import DataErasedScreen from '../components/DataErasedScreen';
import PropTypes from 'prop-types';
import { inject } from '@cleargdpr/elements';
import Subject from '@cleargdpr/elements';

class Container extends React.Component {
  componentDidMount() {
    this.props.subject.fetchData();
  }

  render() {
    const { subject } = this.props;
    if (subject.isGuest) {
      setTimeout(() => this.props.history.push('/sign-up'));
    }

    if (!subject.isFetched) {
      return <LoadingScreen />;
    }

    if (subject.isErased) {
      return <DataErasedScreen />;
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

Container.propTypes = {
  subject: PropTypes.instanceOf(Subject),
  history: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const AttachedToSubjectContext = inject(Container);

export const wrap = component => {
  return props => (
    <AttachedToSubjectContext {...props}>
      {React.createElement(component, props)}
    </AttachedToSubjectContext>
  );
};
