import { Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { StoragePort, UploadFile, UploadResult } from "../ports/storage.port";

const UPLOAD_DIR = join(process.cwd(), "uploads", "media");

@Injectable()
export class LocalStorageAdapter extends StoragePort {
  async upload(file: UploadFile): Promise<UploadResult> {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = extname(file.originalname).toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    await writeFile(join(UPLOAD_DIR, filename), file.buffer);

    const baseUrl = process.env.APP_URL ?? "http://localhost:3001";
    return { url: `${baseUrl}/uploads/media/${filename}` };
  }
}
