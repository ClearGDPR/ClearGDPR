const { db } = require('../../db');
const winston = require('winston');
const { NotFound, Forbidden, BadRequest } = require('../../utils/errors');
const { recordProcessorsUpdate } = require('../../utils/blockchain');


class ProcessorsService {
  constructor(database = db) {
    this.db = database;
  }

  async join(processorInformation){
		const [ processorExists ] = await this.db('processors')
			.where('name', processorInformation.name);
	
		if(processorExists) throw new BadRequest('Processor already exists');

		const [ processorId ] = await this.db('processors')
			.insert(processorInformation)
			.returning('id');

		await this.db('processor_address')
			.insert({
				processor_id: processorId,
				address: 'AAAAAAAAAAAAAAAAAAA'
			})


		return { success: true };
	}

}

module.exports = ProcessorsService;
