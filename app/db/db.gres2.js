// db/postgres.js
const { Sequelize } = require('sequelize');
const {
  DATABASE_NAME_TWO,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_SSL, 
} = require('../constants/app_constants');

const sequelize = new Sequelize(
  DATABASE_NAME_TWO,
  DATABASE_USER,
  DATABASE_PASS,
  {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT) || 5432,
    dialect: 'postgres',
    logging: false, // set to console.log for SQL debugging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: DATABASE_SSL
      ? {
          ssl: typeof DATABASE_SSL === 'object'
            ? DATABASE_SSL
            : { require: true, rejectUnauthorized: false },
        }
      : {},
    define: {
      // global model options (optional)
      underscored: true,
      timestamps: true,
      freezeTableName: true,
    },
    retry: {
      max: 3, // basic transient error retries
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Postgres connection was successful.');
  })
  .catch((error) => {
    console.error('Unable to connect to Postgres:', error);
  });

module.exports = sequelize;
