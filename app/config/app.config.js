const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { mongoDb,mongoose } = require('../db/mongo.db');

//require("../sync-cache-service/sync.service");
//const swaggerUi = require("swagger-ui-express");
//const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
//const openapiSpecification = require("../open-api/swagger.js.doc");

const app = express();

const { APP_SERVER_PORT } = require("../constants/app_constants");

const { db, db2 } = require("../models");

const PORT = APP_SERVER_PORT.toString().split(',')[0];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));
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

(async () => {
  await mongoDb();
})();

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

const swaggerSpecs = require('./swagger.config');
app.get('/api-core-docs/swagger.json', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  } catch (error) {
    console.error("Swagger JSON Error:", error);
    res.status(500).send("Error generating Swagger JSON: " + error.message);
  }
});
app.get('/api-core-docs', (req, res) => {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Areax Core API</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: "/api-core-docs/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            validatorUrl: null
          });
          window.ui = ui;
        };
      </script>
    </body>
    </html>`;
  res.send(html);
});

//-.routes.
require("../routes/app.routes")(app);

module.exports = {
    app,
    PORT,
    mongoose	
};
