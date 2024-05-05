// Importing Sequelize and sequelize from the basemodel.js file
import { Sequelize, sequelize } from './basemodel.js';

// Override timezone formatting for Sequelize DATE type
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss');
};




// Sequelize utilities
const op = Sequelize.Op;
const raw = Sequelize.literal; // use to include raw expression

// Util function for performing filtered queries
const filterBy = function (expression, value) {
	return sequelize.where(raw(expression), value);
}



// Utility function for performing raw queries
function rawQuery(queryText, options) {
	return sequelize.query(queryText, options);
}

// Utility functions for executing raw SQL queries and obtaining results in different formats
async function rawQueryList(queryText, queryParams) {
	const records = await rawQuery(queryText, { replacements: queryParams, type: Sequelize.QueryTypes.SELECT });
	return records;
}

async function rawQueryOne(queryText, queryParams) {
	const records = await rawQueryList(queryText, queryParams);
	return records[0] || null;
}

async function rawQueryValue(queryText, queryParams) {
	const record = await rawQueryOne(queryText, queryParams);
	if (record) {
		return Object.values(record)[0];
	}
	return null;
}

// Utility function for extracting ordering information from request parameters
function getOrderBy(req, sortField = null, sortType = 'desc') {
	const orderBy = req.query.orderby || sortField;
	const orderType = req.query.ordertype || sortType;
	if (orderBy) {
		let order = raw(`${orderBy} ${orderType}`);
		return [[order]];
	}
	return null;
}

export default {
  sequelize,
	op,
	filterBy,
	raw,
	rawQuery,
	rawQueryList,
	rawQueryOne,
	rawQueryValue,
	getOrderBy,
}