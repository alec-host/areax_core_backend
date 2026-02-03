const { app, PORT, mongoose } = require("./config/app.config");

const server = app.listen(PORT, async () => {
   console.log(`Server listening on ${PORT}`);
});

const S3PartitionedJsonLogger = require("./utils/partitioned.json.logger");
const s3Logger = new S3PartitionedJsonLogger();
s3Logger.write("INFO", "Service started", { service: "core" });

const shutdown = async () => {
   s3Logger.write("INFO", "Service shutting down");
   s3Logger.end();
   server.close(async () => {
      try {
         if (mongoose && mongoose.connection && mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
         }
      } catch (err) {
         process.exit(1);
      }
   });
   // Force exit if shutdown stalls
   setTimeout(() => {
      console.warn('Forcing shutdown');
      process.exit(1);
   }, 10000).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

