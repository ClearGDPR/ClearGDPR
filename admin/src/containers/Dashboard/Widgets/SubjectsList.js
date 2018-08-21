import React from 'react';
import config from 'config';
import SubjectsListComponent from 'components/Dashboard/Widgets/SubjectsList';
import internalFetch from 'helpers/internal-fetch';
import Paginate from 'components/core/Paginate';

export class SubjectsListContainer extends React.Component {
  state = {
    isLoading: false,
    errorState: false,
    paging: {},
    subjects: []
  };

  fetchSubjects(page = 1) {
    this.setState({ errorState: false, loading: true });
    internalFetch(`${config.API_URL}/api/management/subjects?page=${page}`)
      .then(({ data, paging }) => {
        this.setState({ subjects: data, paging, loading: false });
      })
      .catch(() => {
        this.setState({ errorState: true, loading: false });
      });
  }

  componentDidMount() {
    this.fetchSubjects();
  }

  handlePageClick = data => {
    const page = data.selected;
    this.fetchSubjects(page + 1);
  };

  render() {
    return (
      <div>
        <SubjectsListComponent {...this.state} />
        <Paginate
          pageCount={(this.state.paging && this.state.paging.total) || 1}
          onPageChange={this.handlePageClick}
        />
      </div>
    );
  }
}

export default SubjectsListContainer;
