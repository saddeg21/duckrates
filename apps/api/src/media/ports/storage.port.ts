export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface UploadResult {
  url: string;
}

export abstract class StoragePort {
  abstract upload(file: UploadFile): Promise<UploadResult>;
}
