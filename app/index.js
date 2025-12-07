const { app, PORT, mongoose } = require("./config/app.config");

app.listen(PORT, async() => {
  console.log(`Server listening on ${PORT}`);
});

const shutdown = async() => {
   server.close(async() => {
      try{
         if(mongoose && mongoose.connection && mongoose.connection.readyState === 1){
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
         }
      }catch(err){
         process.exit(1);
      }
   });
   // Force exit if shutdown stalls
   setTimeout(() => {
      console.warn('Forcing shutdown');
      process.exit(1);
   }, 10000).unref();
};
