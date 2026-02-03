// db/postgres.js
const { Sequelize } = require('sequelize');
const {
  DATABASE_NAME_TWO,
  DATABASE_USER_TWO,
  DATABASE_PASS_TWO,
  DATABASE_HOST_TWO,
  DATABASE_PORT_TWO,
  DATABASE_SSL_TWO,
} = require('../constants/app_constants');

console.log(
  DATABASE_NAME_TWO,
  DATABASE_USER_TWO,
  DATABASE_PASS_TWO,DATABASE_HOST_TWO,DATABASE_PORT_TWO,DATABASE_SSL_TWO,
);
const sequelize = new Sequelize(
  DATABASE_NAME_TWO,
  DATABASE_USER_TWO,
  DATABASE_PASS_TWO,
  {
    host: DATABASE_HOST_TWO,
    port: Number(DATABASE_PORT_TWO) || 5432,
    dialect: 'postgres',
    logging: console.log, // set to console.log for SQL debugging
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: DATABASE_SSL_TWO
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
