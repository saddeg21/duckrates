import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const sessionId = req.cookies["session_id"] as string | undefined;

    if (!sessionId) throw new UnauthorizedException();

    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });

    if (!session || session.expiresAt < new Date()) throw new UnauthorizedException();

    (req as Request & { userId: string }).userId = session.userId;
    return true;
  }
}
