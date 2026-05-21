import { Injectable } from "@nestjs/common";
import { StoragePort, UploadFile, UploadResult } from "./ports/storage.port";

@Injectable()
export class MediaService {
  constructor(private readonly storage: StoragePort) {}

  async upload(file: UploadFile): Promise<UploadResult> {
    return this.storage.upload(file);
  }
}
