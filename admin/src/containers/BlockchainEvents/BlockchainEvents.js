import React from 'react';

import './BlockchainEvents.css';
import config from 'config';

export default class BlockchainEventsContainer extends React.Component {
  state = {
    connected: false,
    errored: false,
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
      const data = JSON.parse(event.data);
      this.addEvent(data.eventName, data.fromName, data.params);
    };
    this.websocket.onerror = event => {
      this.setState({ errored: true });
    };
  }

  componentWillUnmount() {
    this.websocket.close();
  }

  addEvent(eventName, fromName, eventParams) {
    this.setState({
      events: this.state.events.concat([{ name: eventName, from: fromName, params: eventParams }])
    });
  }

  render() {
    const eventItems = this.state.events.map(({ name, from, params }) => {
      return (
        <div className="event-item">
          <strong>{name}</strong> received from <strong>{from}</strong>
          <br />
          <strong>Params:</strong>
          <br />
          <ul>
            {Object.keys(params).map(key => (
              <li>
                <strong>{key}</strong>: {params[key]}
              </li>
            ))}
          </ul>
        </div>
      );
    });

    return (
      <div className="main-container">
        <div>
          <h4>{this.state.connected ? 'Connected' : 'Connecting..'}</h4>
          {this.state.errored && <h4>Something went wrong :(</h4>}
        </div>
        {eventItems}
      </div>
    );
  }
}
