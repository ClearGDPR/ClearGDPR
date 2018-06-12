const { db } = require('../../db');
const crypto = require('crypto');
const { NotFound, BadRequest } = require('./../../utils/errors');
const { decryptFromStorage } = require('../../utils/encryption');

class DataShareService {
  async getDataShares(subjectId) {
    return db('data_shares')
      .where({ subject_id: subjectId })
      .map(dataShare => ({
        name: dataShare.name,
        url: `${process.env.url}/api/subjects/data-shares/share?token=${dataShare.token}`
      }));
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
    if (!dataShare) throw new NotFound('Data Share not found');
    await db('data_shares')
      .delete()
      .where({
        id: dataShareId
      });
  }

  async getDataForShare(token) {
    const [data] = await db('data_shares')
      .where({ token })
      .join('subjects', 'data_shares.subject_id', 'subjects.id')
      .leftJoin('subject_keys', 'subjects.id', 'subject_keys.subject_id')
      .select('personal_data')
      .select('key');

    if (!data) {
      throw new NotFound('Data share not found');
    }

    if (!data.key) {
      throw new BadRequest('Could not access subjects data');
    }

    const decryptedData = decryptFromStorage(data.personal_data, data.key);
    return JSON.parse(decryptedData);
  }
}

module.exports = DataShareService;
