const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//require("../sync-cache-service/sync.service");
//const swaggerUi = require("swagger-ui-express");
//const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
//const openapiSpecification = require("../open-api/swagger.js.doc");

const app = express();

const { APP_SERVER_PORT } = require("../constants/app_constants");

const { db, db2 } = require("../models");

const PORT = APP_SERVER_PORT.toString().split(',')[0];
console.log(APP_SERVER_PORT.toString(),' ',APP_SERVER_PORT.toString().split(',')[0]);

app.use(helmet());
app.use(cors());

//-.trust first proxy.
app.set('trust proxy', 1);
/*
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use("/api/v1/", limiter);
*/
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

db.sequelize.sync({ /*alter: true*/ })
  .then(() => {
   console.log("Synced db.");
})
  .catch((err) => {
   console.log("Failed to sync db: " + err.message);
});

db2.sequelize.sync()
  .then(() => {
   console.log("Synced db2.")
})
  .catch((err) => {
   console.log("Failed to sync db2: " + err.message);
});

app.use(morgan('tiny'));

app.use(express.static('uploads'));

//app.use("/api-docs", swaggerUi.serve, express.static(pathToSwaggerUi,{index:false}),swaggerUi.setup(openapiSpecification));

//app.use((req, res, next) => { res.status(404).json({ success: false, error: true, error: true, message: 'Endpoint not found or parameter missing' }); });

//-.routes.
require("../routes/app.routes")(app);

module.exports = {
    app,
    PORT
};
