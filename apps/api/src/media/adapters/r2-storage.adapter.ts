import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "node:path";
import { StoragePort, UploadFile, UploadResult } from "../ports/storage.port";

@Injectable()
export class R2StorageAdapter extends StoragePort {
  private readonly s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  async upload(file: UploadFile): Promise<UploadResult> {
    const ext = extname(file.originalname).toLowerCase();
    const key = `${crypto.randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return { url: `${process.env.R2_PUBLIC_URL}/${key}` };
  }
}
