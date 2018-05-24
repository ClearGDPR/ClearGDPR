const fs = require('fs');
let arguments = process.argv.slice(2);
let staticNodes = [];

arguments.forEach(dir => {
  const path = `${process.cwd()}/quorum/generated_configs/${dir}/static_nodes_entry`;
  // console.log(path);
  const nodeEntry = fs
    .readFileSync(path)
    .toString()
    .split('\n')
    .shift();
  staticNodes.push(nodeEntry);
});

const staticNodesClear = JSON.stringify(staticNodes);
const staticNodesBase64 = Buffer.from(staticNodesClear).toString('base64');

// console.log(`${staticNodesClear}`);
console.log(`${staticNodesBase64}`);
