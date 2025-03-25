const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();

const app = express();

const { APP_SERVER_PORT } = require("../constants/app_constants");

const openapiSpecification = require("../open-api/swagger.js.doc");

const PORT = APP_SERVER_PORT.toString().split(',')[3];
console.log(APP_SERVER_PORT.toString(),' ',APP_SERVER_PORT.toString().split(',')[3]);

app.use(cors());
app.use(express.json());

app.use(morgan('tiny'));

app.use(express.static('uploads'));

app.use("/api-docs", swaggerUi.serve, express.static(pathToSwaggerUi,{index:false}),swaggerUi.setup(openapiSpecification));

//-.routes.
require("../routes/app.gemini.routes")(app);

module.exports = {
    app,
    PORT
};
