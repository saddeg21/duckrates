import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { SessionGuard } from "../common/guards/session.guard";

@Module({
  controllers: [PostsController],
  providers: [PostsService, SessionGuard],
})
export class PostsModule {}
