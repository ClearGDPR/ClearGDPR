import React from 'react';
//import config from 'config';
import SubjectsListComponent from 'components/Dashboard/Widgets/EventsList';
import Paginate from 'components/core/Paginate';

export class EventsListContainer extends React.Component {
  state = {
    isLoading: false,
    errorState: false,
    paging: {},
    events: [
      JSON.parse(
        '{"params":{"0":"0x3b4066bd7b7960752225af105d3beafb5c47a26c5aae7e6798a437b7c0bb33e6","1":["0x9954CC7e418D3D1833B2971711eb068D083a4166","0x78243779b6c9598392a87869e7cb76fa799D938C"],"subjectId":"0x3b4066bd7b7960752225af105d3beafb5c47a26c5aae7e6798a437b7c0bb33e6","processorsConsented":["0x9954CC7e418D3D1833B2971711eb068D083a4166","0x78243779b6c9598392a87869e7cb76fa799D938C"]},"eventName":"Controller_ConsentGivenTo","from":"0x9954CC7e418D3D1833B2971711eb068D083a4166","time":1532960063175,"fromName":"Master Controller Node"}'
      )
    ]
  };

  componentDidMount() {
    this.ws = new WebSocket('ws://localhost:8082/api/management/events/feed');

    this.ws.onmessage = event => {
      const eventData = JSON.parse(event.data);
      console.log(eventData);
      this.setState({ events: this.state.events.concat([eventData]) });
    };
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
