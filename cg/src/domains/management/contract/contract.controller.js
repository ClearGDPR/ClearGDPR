const { BadRequest } = require('../../../utils/errors');
const ContractService = require('./contract.service');
const { NotFound } = require('../../../utils/errors');

class ContractController {
  constructor(contractService = null) {
    this.service = contractService || new ContractService();
  }

  async deployContract(req, res) {
    if (!req.body.abiJson || !req.body.compiledData) {
      throw new BadRequest(`The contract must contain values for 'abiJson' and 'compiledData'.`);
    }
    let parsedAbi = JSON.parse(req.body.abiJson);
    res.json({
      address: await this.service.deployContract(parsedAbi, req.body.compiledData)
    });
  }

  async getContractDetails(req, res) {
    const result = await this.service.getContractDetails();
    if (!result) {
      throw new NotFound('No contract deployed');
    }
    return res.json(result);
  }

  async subscribeToEventFeed(ws, req) {
    await this.service.onContractEvent(event => {
      ws.send(JSON.stringify(event));
    });
  }
}

module.exports = ContractController;
