import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { SessionGuard } from "../common/guards/session.guard";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { SchedulePostDto } from "./dto/schedule-post.dto";

type AuthenticatedRequest = Request & { userId: string };

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get("public")
  async getPublic() {
    return this.postsService.listPublic();
  }

  @Get("public/random-featured")
  async getRandomFeatured() {
    return this.postsService.getRandomFeatured();
  }

  @Get("public/archive")
  async getPublicArchive(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const limitNum = Math.min(
      50,
      Math.max(1, parseInt(limit ?? "10", 10) || 10),
    );
    return this.postsService.listPublicArchive(pageNum, limitNum);
  }

  @Get("public/:id")
  async getPublicById(@Param("id") id: string) {
    return this.postsService.getPublicById(id);
  }

  @Get("public/category/:category")
  async getPublicByCategory(
    @Param("category") category: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit ?? "5", 10) || 5));
    return this.postsService.listPublicByCategory(category, pageNum, limitNum);
  }

  @Get("dashboard")
  @UseGuards(SessionGuard)
  async getDashboard(
    @Req() req: AuthenticatedRequest,
    @Query("page") page?: string,
    @Query("status") status?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
    return this.postsService.listDashboard(req.userId, pageNum, status);
  }

  @Get("dashboard/:id")
  @UseGuards(SessionGuard)
  async getDashboardById(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.getDashboardById(id, req.userId);
  }

  @Post()
  @UseGuards(SessionGuard)
  async create(@Body() body: CreatePostDto, @Req() req: AuthenticatedRequest) {
    return this.postsService.create(
      body.title,
      body.content,
      req.userId,
      body.coverImageKey,
      body.categories,
    );
  }

  @Patch(":id")
  @UseGuards(SessionGuard)
  async update(
    @Param("id") id: string,
    @Body() body: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.update(
      id,
      body.title,
      body.content,
      req.userId,
      body.coverImageKey,
      body.categories,
    );
  }

  @Patch(":id/publish")
  @UseGuards(SessionGuard)
  async publish(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return this.postsService.publish(id, req.userId);
  }

  @Patch(":id/schedule")
  @UseGuards(SessionGuard)
  async schedule(
    @Param("id") id: string,
    @Body() body: SchedulePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.schedule(id, req.userId, body.publishAt);
  }

  @Patch(":id/archive")
  @UseGuards(SessionGuard)
  async archive(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return this.postsService.archive(id, req.userId);
  }

  @Patch(":id/revert")
  @UseGuards(SessionGuard)
  async revert(@Param("id") id: string, @Req() req: AuthenticatedRequest) {
    return this.postsService.revertToDraft(id, req.userId);
  }

  @Post(":id/cover")
  @UseGuards(SessionGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadCover(
    @Param("id") id: string,
    @UploadedFile()
    file:
      | { buffer: Buffer; mimetype: string; originalname: string; size: number }
      | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.postsService.uploadCover(id, req.userId, file!);
  }
}
