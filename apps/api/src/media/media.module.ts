import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { StoragePort } from "./ports/storage.port";
import { R2StorageAdapter } from "./adapters/r2-storage.adapter";
import { LocalStorageAdapter } from "./adapters/local-storage.adapter";
import { SessionGuard } from "../common/guards/session.guard";

@Module({
  controllers: [MediaController],
  providers: [
    SessionGuard,
    {
      provide: StoragePort,
      useFactory: () =>
        process.env.NODE_ENV === "production"
          ? new R2StorageAdapter()
          : new LocalStorageAdapter(),
    },
    MediaService,
  ],
})
export class MediaModule {}
