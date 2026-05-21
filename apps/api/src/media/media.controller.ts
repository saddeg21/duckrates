import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { MediaService } from "./media.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { SessionGuard } from "../common/guards/session.guard";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile()
    file:
      | { buffer: Buffer; mimetype: string; originalname: string }
      | undefined,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    const result = await this.mediaService.upload(file);
    return result;
  }
}
