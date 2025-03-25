const { app, PORT } = require("./config/app.hugging.face.config");

app.listen(PORT, async() => {
  console.log(`Server listening on ${PORT}`);
});