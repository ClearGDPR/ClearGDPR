const ContractService = require('./contract.service');
const { NotFound } = require('../../../utils/errors');

class ContractController {
  constructor(contractService = null) {
    this.service = contractService || new ContractService();
  }

  async deployContract(req, res) {
    let parsedABI = JSON.parse(req.body.contractABIJson);
    res.json({
      address: await this.service.deployContract(parsedABI, req.body.contractByteCode)
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
