const StatsService = require('./stats.service');

class StatsController {
  constructor() {
    this.statsService = this.statsService || new StatsService();
  }

  async stats(req, res) {
    const data = await this.statsService.stats();
    return res.json({ data });
  }

  async events(req, res) {
    const { eventType = 'allEvents', fromBlock = 0, toBlock = 'latest', filter = null } = req.query;
    let _filter;
    try {
      _filter = JSON.parse(filter);
    } catch (e) {
      _filter = null;
    }
    const events = await this.statsService.events(eventType, fromBlock, toBlock, _filter);
    return res.json(events);
  }
}

module.exports = StatsController;
