const { db } = require('../../db');
const crypto = require('crypto');

class DataShareService {
  async getDataShares(subjectId) {
    return db('data_shares').where({ subject_id: subjectId });
  }

  async createDataShare(subjectId, name) {
    const token = crypto.randomBytes(48).toString('hex');
    await db('data_shares').insert({
      subject_id: subjectId,
      token,
      name
    });
  }
  async removeDataShare(dataShareId) {
    await db('data_shares')
      .delete()
      .where({
        id: dataShareId
      });
  }
}

module.exports = DataShareService;
