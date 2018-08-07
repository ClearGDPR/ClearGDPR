import React from 'react';
import PropTypes from 'prop-types';
import SubjectsListComponent from 'components/Dashboard/Widgets/EventsList';

class EventsListContainer extends React.Component {
  state = {
    errorState: false,
    connected: false,
    paging: {},
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

  render() {
    return (
      <div>
        <SubjectsListComponent {...this.state} />
      </div>
    );
  }
}

EventsListContainer.propTypes = {
  webSocketUrl: PropTypes.string
};

export default EventsListContainer;
