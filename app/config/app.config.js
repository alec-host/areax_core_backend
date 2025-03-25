const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//const swaggerUi = require("swagger-ui-express");
//const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
//const openapiSpecification = require("../open-api/swagger.js.doc");

const app = express();

const { APP_SERVER_PORT } = require("../constants/app_constants");

const { db, db2 } = require("../models");

const PORT = APP_SERVER_PORT.toString().split(',')[0];
console.log(APP_SERVER_PORT.toString(),' ',APP_SERVER_PORT.toString().split(',')[0]);

app.use(cors());
app.use(express.json());

db.sequelize.sync()
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
