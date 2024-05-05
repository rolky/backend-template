import Sequelize from "sequelize";

import config from "../config.js";

// Extracting database configuration details from the imported config module
const dbConfig = config.database;

// Creating a new Sequelize instance for database connection
const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
  dialect: dbConfig.type, // Database type (e.g., 'postgres')
  host: dbConfig.host, // Database host address
  port: dbConfig.port, // Database port
  pool: {
    max: 15, // Maximum number of connections in the pool
    min: 5,  // Minimum number of connections in the pool
    idle: 20000, // Maximum time, in milliseconds, that a connection can be idle before being released
    evict: 15000, // Time interval, in milliseconds, to check for idle connections to evict
    acquire: 30000 // Maximum time, in milliseconds, to wait for a connection from the pool
  },
  define: {
    timestamps: false, // Disable timestamps (createdAt, updatedAt) by default in models
    freezeTableName: true // Prevent Sequelize from pluralizing table names
  },
  operatorsAliases: 0 // Disable operator aliases to prevent deprecation warnings
});

// Defining a base model class that extends Sequelize.Model
class BaseModel extends Sequelize.Model {
  
  // Static method to find a single value in a specified column based on given conditions
  static async findValue(column, where) {
    const row = await this.findOne({
      attributes: [column],
      where
    });

    if (row) {
      return row[column];
    }
    return null;
  }
  
  // Static method to paginate query results
  static async paginate(query, page, limit) {
    query.offset = limit * (page - 1);
    query.limit = limit;
    let result = await this.findAndCountAll(query);
    let totalRecords = result.count;
    let records = result.rows;
    let recordCount = records.length;
    let totalPages = Math.ceil(totalRecords / limit);
    let data = {
      totalRecords,
      recordCount,
      totalPages,
      records
    }
    return data;
  }




}

// Exporting the BaseModel class, sequelize instance, and Sequelize object
export { BaseModel, Sequelize, sequelize };

