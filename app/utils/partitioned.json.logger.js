// jsonLogger.js
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { PassThrough } = require("stream");


const { AWS_BUCKET_ACCESS_KEY_ID, AWS_BUCKET_SECRET_ACCESS_KEY, AWS_BUCKET_REGION, AWS_BUCKET_NAME_1 } = require("../constants/app_constants");

const s3 = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
  },
});

class S3PartitionedJsonLogger {
  constructor(bucketName = AWS_BUCKET_NAME_1, prefix = "logs/") {
    this.bucket = bucketName;
    this.prefix = prefix;

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hour = String(now.getUTCHours()).padStart(2, "0");

    // Partition path: logs/year=YYYY/month=MM/day=DD/hour=HH/
    const partitionPath = `${this.prefix}year=${year}/month=${month}/day=${day}/hour=${hour}/`;

    this.stream = new PassThrough();
    this.upload = new Upload({
      client: s3,
      params: {
        Bucket: this.bucket,
        Key: `${partitionPath}${Date.now()}.jsonl`, // JSON Lines format
        Body: this.stream,
      },
    });

    this.upload.done().catch((err) => {
      console.error("S3 log upload failed:", err);
    });
  }

  write(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta, // include extra fields like userId, requestId, etc.
    };
    this.stream.write(JSON.stringify(logEntry) + "\n"); // JSONL
  }

  end() {
    this.stream.end();
  }
}

module.exports = S3PartitionedJsonLogger;

