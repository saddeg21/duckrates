import { Body, Controller, Get, HttpCode, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { SessionGuard } from "../common/guards/session.guard";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

type AuthenticatedRequest = Request & { userId: string };

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(SessionGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.getUserById(req.userId);
  }

  @Patch("me")
  @UseGuards(SessionGuard)
  async updateMe(@Body() body: UpdateProfileDto, @Req() req: AuthenticatedRequest) {
    return this.usersService.updateUser(req.userId, body);
  }

  @Patch("me/password")
  @UseGuards(SessionGuard)
  @HttpCode(204)
  async changePassword(@Body() body: ChangePasswordDto, @Req() req: AuthenticatedRequest) {
    await this.usersService.changePassword(req.userId, body.currentPassword, body.newPassword);
  }

  @Get(":id/public")
  async getPublicProfile(
    @Param("id") id: string,
    @Query("page") page?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
    return this.usersService.getPublicProfile(id, pageNum);
  }
}
