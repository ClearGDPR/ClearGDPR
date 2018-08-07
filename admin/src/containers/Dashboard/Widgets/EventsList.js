import React from 'react';
import config from 'config';
import SubjectsListComponent from 'components/Dashboard/Widgets/EventsList';
import Paginate from 'components/core/Paginate';

export class EventsListContainer extends React.Component {
  state = {
    isLoading: false,
    errorState: false,
    paging: {},
    events: []
  };

  componentDidMount() {
    this.websocket = new WebSocket(
      config.API_URL.replace('http://', 'ws://') + '/api/management/events/feed'
    );
    this.websocket.onopen = event => {
      this.setState({ connected: true });
    };
    this.websocket.onmessage = event => {
      this._addEvent(JSON.parse(event.data));
    };
    this.websocket.onclose = () => {
      this.setState({ connected: false });
    };
    this.websocket.onerror = event => {
      this.setState({ errorState: true });
    };
  }

  _addEvent(event) {
    this.setState({ events: this.state.events.concat([event]) });
  }

  componentWillUnmount() {
    this.ws.close();
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

export default EventsListContainer;
