import React from 'react';

import SubjectsListComponent from 'components/Widgets/SubjectsList';
import internalFetch from './internal-fetch';

export class SubjectsListContainer extends React.Component {
  state = {
    isLoading: false,
    errorState: false,
    subjects: []
  };

  fetchSubjects() {
    this.setState({ errorState: false, loading: true });
    internalFetch('/api/management/subjects/list')
      .then(({ data: subjects, paging }) => {
        this.setState({ subjects, paging, loading: false });
      })
      .catch(err => {
        this.setState({ errorState: true, loading: false });
      });
  }

  componentDidMount() {
    this.fetchSubjects();
  }

  render() {
    return <SubjectsListComponent {...this.state} />;
  }
}

export default SubjectsListContainer;
