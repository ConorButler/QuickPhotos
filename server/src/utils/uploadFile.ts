import { S3 } from "aws-sdk";
import { FileUpload } from "graphql-upload";
import { nanoid } from "nanoid";

export function uploadFile(file: FileUpload) {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });

  console.log("inside upload");

  const fileStream = file.createReadStream();
  const params = {
    ContentType: "image/jpeg",
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: `${nanoid()}.jpg`,
  };

  return s3.upload(params).promise();
}
