import React from 'react';
import LoadingScreen from '../Elements/components/Common/Views/LoadingScreen';
import DataErasedScreen from '../Elements/components/Common/Views/DataErasedScreen';
import { inject } from './SubjectContext';

class Container extends React.Component {
  componentDidMount() {
    this.props.subject.fetchData();
  }

  render() {
    const { subject } = this.props;

    if (subject.isGuest) {
      this.props.history.push('/sign-up');
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

const AttachedToSubjectContext = inject(Container);

export const wrap = component => {
  return props => (
    <AttachedToSubjectContext {...props}>
      {React.createElement(component, props)}
    </AttachedToSubjectContext>
  );
};
