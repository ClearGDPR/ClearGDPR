import React from 'react';
import PropTypes from 'prop-types';
import EventsListComponent from 'components/Dashboard/Widgets/EventsList';
import Paginate from 'components/core/Paginate';

class EventsListContainer extends React.Component {
  state = {
    errorState: false,
    connected: false,
    selectedPage: 0,
    events: []
  };

  componentDidMount() {
    this.websocket = new WebSocket(this.props.webSocketUrl);
    this.websocket.onopen = event => {
      this.setState({ connected: true });
    };
    this.websocket.onmessage = event => {
      this._addEvent(JSON.parse(event.data));
    };
    this.websocket.onclose = () => {
      if (!this._isUnmounted) {
        this.setState({ connected: false });
      }
    };
    this.websocket.onerror = event => {
      this.setState({ errorState: true });
    };
  }

  _addEvent(event) {
    this.setState({ events: this.state.events.concat([event]) });
  }

  componentWillUnmount() {
    this._isUnmounted = true;
    this.websocket.close();
  }

  handlePageClick = ({ selected }) => {
    this.setState({ selectedPage: selected });
  };

  render() {
    const { events, selectedPage } = this.state;
    const { pageSize } = this.props;
    const offset = selectedPage * pageSize;
    const totalPages = Math.ceil(events.length / pageSize);

    return (
      <div>
        <EventsListComponent
          {...{ ...this.state, events: events.slice(offset, offset + pageSize) }}
        />
        <Paginate pageCount={totalPages || 1} onPageChange={this.handlePageClick} />
      </div>
    );
  }
}

EventsListContainer.propTypes = {
  webSocketUrl: PropTypes.string,
  pageSize: PropTypes.number
};

EventsListContainer.defaultProps = {
  pageSize: 20
};

export default EventsListContainer;
