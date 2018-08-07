import React from 'react';
import { shallow } from 'enzyme';
import * as mockSocket from 'mock-socket';
import EventsList from './EventsList';
import Paginate from '../../../components/core/Paginate';
import EventsListComponent from '../../../components/Dashboard/Widgets/EventsList';

window.WebSocket = mockSocket.WebSocket;

const fakeUrl = 'ws://localhost:8080';
const setup = (socketUrl, pageSize = 20) =>
  shallow(<EventsList webSocketUrl={socketUrl || fakeUrl} pageSize={pageSize} />);

let mockServer;

describe('Events list', () => {
  beforeEach(() => {
    mockServer = new mockSocket.Server(fakeUrl);
  });

  it('should connect to websocket', async done => {
    const component = setup();

    expect(component.state().connected).toBe(false);

    setTimeout(() => {
      expect(component.state().connected).toBe(true);
      done();
    }, 100);
  });

  it('should set error state on websocket connection error', async done => {
    const component = setup('ws://wrong-socket-url');

    setTimeout(() => {
      expect(component.state().errorState).toBe(true);
      done();
    }, 100);
  });

  it('should reset connection flag', async done => {
    const component = setup();

    mockServer.on('connection', socket => {
      expect(component.state().connected).toBe(true);
      mockServer.close();
    });

    setTimeout(() => {
      expect(component.state().connected).toBe(false);
      done();
    }, 200);
  });

  it('should listen to blockchain events ', async done => {
    const component = setup();

    mockServer.on('connection', socket => {
      expect(component.state().events).toHaveLength(0);
      socket.send(JSON.stringify({ event: 'test', foo: 'bar' }));
      socket.send(JSON.stringify({ event: 'test', foo: 'baz' }));
    });

    setTimeout(() => {
      const { events } = component.state();
      expect(events).toHaveLength(2);
      expect(events[0].foo).toBe('bar');
      expect(events[1].foo).toBe('baz');
      done();
    }, 200);
  });

  it('should render paginator', async done => {
    const pageSize = 2;
    const component = setup(fakeUrl, pageSize);

    mockServer.on('connection', socket => {
      for (let i = 0; i < 10; i++) {
        socket.send(JSON.stringify({ event: 'test', i }));
      }
    });

    setTimeout(() => {
      component.update();
      const paginator = component.find(Paginate);
      expect(paginator.props().pageCount).toBe(5);
      done();
    }, 200);
  });

  it('should pass one page to nested component', async done => {
    const pageSize = 2;
    const component = setup(fakeUrl, pageSize);

    mockServer.on('connection', socket => {
      for (let i = 0; i < 10; i++) {
        socket.send(JSON.stringify({ event: 'test', i }));
      }
    });

    setTimeout(() => {
      component.update();
      const listComponent = component.find(EventsListComponent);
      const { events } = listComponent.props();
      expect(events).toHaveLength(pageSize);
      expect(events[0].i).toBe(0);
      expect(events[1].i).toBe(1);
      done();
    }, 200);
  });

  it('should close websocket connection after unmount', async done => {
    const component = setup();
    const spy = jest.spyOn(window.WebSocket.prototype, 'close');

    mockServer.on('connection', socket => {
      component.unmount();
    });

    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 200);
  });

  afterEach(() => mockServer.stop());
});
