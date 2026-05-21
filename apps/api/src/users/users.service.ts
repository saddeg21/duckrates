import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  profilePic: true,
  bio: true,
  createdAt: true,
} as const;

function extractExcerpt(doc: unknown, maxLength = 180): string {
  function walk(node: unknown): string {
    if (!node || typeof node !== "object") return "";
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (n.type === "text") return n.text ?? "";
    if (!Array.isArray(n.content)) return "";
    return n.content.map(walk).join(" ");
  }
  const text = walk(doc).replace(/\s+/g, " ").trim();
  return text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + "…";
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  async updateUser(id: string, data: { name?: string; email?: string; profilePic?: string; bio?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  async getPublicProfile(id: string, page: number) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, profilePic: true, bio: true },
    });

    if (!user) throw new NotFoundException("Author not found");

    const [posts, totalPosts] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: { authorId: id, status: "published" },
        orderBy: { publishedAt: "desc" },
        skip,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          publishedAt: true,
          coverImageKey: true,
          categories: true,
          authorId: true,
          content: true,
        },
      }),
      this.prisma.post.count({ where: { authorId: id, status: "published" } }),
    ]);

    return {
      ...user,
      totalPosts,
      totalPages: Math.ceil(totalPosts / PAGE_SIZE),
      page,
      posts: posts.map(({ content, ...post }) => ({
        ...post,
        authorName: user.name,
        excerpt: extractExcerpt(content),
      })),
    };
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException();

    const valid = await argon2.verify(user.passwordHash, currentPassword);
    if (!valid) throw new UnauthorizedException("Current password is incorrect");

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }
}
