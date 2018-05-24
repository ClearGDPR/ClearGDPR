/* eslint no-undef: 0 */

const exampleSocket = new WebSocket('ws://localhost:8082/api/management/events/feed');

function writeOut(output) {
  const outputNode = document.createElement('p');
  outputNode.innerHTML = output;
  document.getElementById('output').appendChild(outputNode);
}

exampleSocket.onopen = event => {
  writeOut('socket opened');
  exampleSocket.send('test');
};

exampleSocket.onmessage = event => {
  const data = JSON.parse(event.data);
  writeOut(`<strong>${data.eventName}</strong> received from <strong>${data.fromName}</strong><br/>
    <strong>Params:</strong>
    <ul>
      ${Object.keys(data.params)
        .map(key => `<li><strong>${key}</strong>: ${data.params[key]}</li>`)
        .join('')}
    </ul>
  `);
};

exampleSocket.onerror = err => {
  console.error(err);
  writeOut('An error occurred');
};
