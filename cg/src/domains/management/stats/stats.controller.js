const StatsService = require('./stats.service');

class StatsController {
  constructor() {
    this.statsService = this.statsService || new StatsService();
  }

  async stats(req, res) {
    const data = await this.statsService.stats();
    return res.json({ data });
  }
}

module.exports = StatsController;
