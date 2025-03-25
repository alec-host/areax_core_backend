const { app, PORT } = require("./config/app.gemini.config");

app.listen(PORT, async() => {
  console.log(`Server listening on ${PORT}`);
});
