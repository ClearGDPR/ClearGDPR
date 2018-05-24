const utils = require('web3-utils');
const web3CoreHelpers = require('web3-core-helpers');
const _ = require('underscore');

web3CoreHelpers.formatters.outputBlockFormatter = function(block) {
  // transform to number
  block.gasLimit = utils.hexToNumber(block.gasLimit);
  block.gasUsed = utils.hexToNumber(block.gasUsed);
  block.size = utils.hexToNumber(block.size);
  block.timestamp = utils.hexToNumberString(block.timestamp);
  if (block.number !== null) block.number = utils.hexToNumber(block.number);

  if (block.difficulty)
    block.difficulty = web3CoreHelpers.formatters.outputBigNumberFormatter(block.difficulty);
  if (block.totalDifficulty)
    block.totalDifficulty = web3CoreHelpers.formatters.outputBigNumberFormatter(
      block.totalDifficulty
    );

  if (_.isArray(block.transactions)) {
    block.transactions.forEach(function(item) {
      if (!_.isString(item)) return web3CoreHelpers.formatters.outputTransactionFormatter(item);
    });
  }

  if (block.miner) block.miner = utils.toChecksumAddress(block.miner);

  return block;
};
