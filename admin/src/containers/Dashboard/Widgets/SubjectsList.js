import React from 'react';
import config from 'config';
import SubjectsListComponent from 'components/Dashboard/Widgets/SubjectsList';
import internalFetch from 'helpers/internal-fetch';

export class SubjectsListContainer extends React.Component {
  state = {
    isLoading: false,
    errorState: false,
    subjects: []
  };

  fetchSubjects() {
    this.setState({ errorState: false, loading: true });
    internalFetch(`${config.API_URL}/api/management/subjects/list`)
      .then(({ subjects, paging }) => {
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
