import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(email: string, name: string, password: string): Promise<{ userId: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Email already in use");

    const passwordHash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: { id: crypto.randomUUID(), email, name, passwordHash, role: "author" },
    });

    return { userId: user.id };
  }

  async login(email: string, password: string): Promise<{ userId: string; sessionId: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const session = await this.prisma.session.create({
      data: { id: crypto.randomUUID(), userId: user.id, expiresAt },
    });

    return { userId: user.id, sessionId: session.id };
  }

  async logout(sessionId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { id: sessionId } });
  }
}
