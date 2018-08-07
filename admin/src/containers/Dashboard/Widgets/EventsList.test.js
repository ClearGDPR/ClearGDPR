import React from 'react';
import { shallow } from 'enzyme';
import * as mockSocket from 'mock-socket';
import EventsList from './EventsList';

window.WebSocket = mockSocket.WebSocket;

const fakeUrl = 'ws://localhost:8080';
const setup = socketUrl => shallow(<EventsList webSocketUrl={socketUrl || fakeUrl} />);

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

  it('should close websocket connection after unmount', async done => {
    //const spy = jest.spyOn(WebSocket, 'close');
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

  afterEach(() => mockServer.close());
});
