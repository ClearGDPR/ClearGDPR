const fs = require('fs');
let arguments = process.argv.slice(2);
let currentNode = arguments.shift();
let otherNodes = [];

arguments.filter(node => node !== currentNode).forEach(node => {
  const path = `${process.cwd()}/quorum/generated_configs/${node}/node.url`;
  // console.log(path);
  const nodeUrl = fs
    .readFileSync(path)
    .toString()
    .split('\n')
    .shift();
  otherNodes.push(`"${nodeUrl}"`);
});

console.log(`${otherNodes.join(',')}`);
