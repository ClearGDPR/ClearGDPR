const { db } = require('../../db');
const crypto = require('crypto');
const { BadRequest } = require('./../../utils/errors');

class DataShareService {
  async getDataShares(subjectId) {
    console.log(subjectId);
    return db('data_shares').where({ subject_id: subjectId });
  }

  async createDataShare(subjectId, name) {
    const token = crypto.randomBytes(48).toString('hex');
    const data = {
      subject_id: subjectId,
      token,
      name
    };
    await db('data_shares').insert(data);
  }
  async removeDataShare(dataShareId) {
    const [dataShare] = await db('data_shares').where({ id: dataShareId });
    if (!dataShare) throw new BadRequest('Data Share not found');
    await db('data_shares')
      .delete()
      .where({
        id: dataShareId
      });
  }
}

module.exports = DataShareService;
