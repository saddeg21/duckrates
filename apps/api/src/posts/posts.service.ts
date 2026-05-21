import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { PrismaService } from "../prisma/prisma.service";
import { canTransition, PostStatus } from "../common/types";

const TIPTAP_EXTENSIONS = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: false }),
  Underline,
];

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function extractExcerpt(doc: unknown, maxLength = 180): string {
  function walk(node: unknown): string {
    if (!node || typeof node !== "object") return "";
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (n.type === "text") return n.text ?? "";
    if (!Array.isArray(n.content)) return "";
    return n.content.map(walk).join(" ");
  }
  const text = walk(doc).replace(/\s+/g, " ").trim();
  return text.length <= maxLength
    ? text
    : text.slice(0, maxLength).trimEnd() + "…";
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic() {
    const posts = await this.prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        publishedAt: true,
        coverImageKey: true,
        categories: true,
        authorId: true,
        author: { select: { name: true } },
      },
    });
    return posts.map(({ author, content, ...rest }) => ({
      ...rest,
      authorName: author?.name ?? "",
      excerpt: extractExcerpt(content),
    }));
  }

  async getRandomFeatured() {
    const recent = await this.prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        publishedAt: true,
        coverImageKey: true,
        categories: true,
        authorId: true,
        author: { select: { name: true } },
      },
    });
    if (recent.length === 0) return null;
    const pick = recent[Math.floor(Math.random() * recent.length)];
    const { author, content, ...rest } = pick;
    return {
      ...rest,
      authorName: author?.name ?? "",
      excerpt: extractExcerpt(content),
    };
  }

  async getPublicById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id, status: "published" },
      include: { author: { select: { name: true, profilePic: true } } },
    });
    if (!post) throw new NotFoundException("Post not found");
    const renderedContent = generateHTML(
      post.content as Parameters<typeof generateHTML>[0],
      TIPTAP_EXTENSIONS,
    );
    const { author, ...rest } = post;
    return {
      ...rest,
      authorName: author?.name ?? "",
      authorProfilePic: author?.profilePic ?? null,
      renderedContent,
    };
  }

  async listPublicArchive(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = { status: "published" as const };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          publishedAt: true,
          coverImageKey: true,
          categories: true,
          authorId: true,
          author: { select: { name: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(({ author, content, ...rest }) => ({
        ...rest,
        authorName: author?.name ?? "",
        excerpt: extractExcerpt(content),
      })),
      page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }

  async listPublicByCategory(category: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = {
      status: "published" as const,
      categories: { has: category.toLowerCase() },
    };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          publishedAt: true,
          coverImageKey: true,
          categories: true,
          authorId: true,
          author: { select: { name: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(({ author, content, ...rest }) => ({
        ...rest,
        authorName: author?.name ?? "",
        excerpt: extractExcerpt(content),
      })),
      page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }

  async listDashboard(userId: string, page: number, status?: string) {
    const PAGE_SIZE = 10;
    const skip = (page - 1) * PAGE_SIZE;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const baseWhere = user?.role === "admin" ? {} : { authorId: userId };
    const where = status ? { ...baseWhere, status } : baseWhere;

    const [posts, total, statusGroups] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          status: true,
          categories: true,
          publishedAt: true,
          updatedAt: true,
          author: { select: { name: true } },
        },
      }),
      this.prisma.post.count({ where }),
      this.prisma.post.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: true,
      }),
    ]);

    const statusCounts = Object.fromEntries(
      statusGroups.map((g) => [g.status, g._count]),
    );

    return {
      posts,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
      total,
      statusCounts,
    };
  }

  async getDashboardById(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true } } },
    });
    if (!post) throw new NotFoundException("Post not found");
    await this.assertCanModify(post.authorId, userId);
    return post;
  }

  async create(
    title: string,
    content: unknown,
    authorId: string,
    coverImageKey?: string | null,
    categories?: string[],
  ) {
    const post = await this.prisma.post.create({
      data: {
        id: crypto.randomUUID(),
        title,
        content: content as object,
        status: "draft",
        authorId,
        ...(coverImageKey !== undefined && { coverImageKey }),
        ...(categories !== undefined && { categories }),
      },
    });
    return { postId: post.id };
  }

  async update(
    id: string,
    title: string,
    content: unknown,
    userId: string,
    coverImageKey?: string | null,
    categories?: string[],
  ) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("Post not found");
    await this.assertCanModify(post.authorId, userId);
    const data: Record<string, unknown> = { title, content: content as object };
    if (coverImageKey !== undefined) data.coverImageKey = coverImageKey;
    if (categories !== undefined) data.categories = categories;
    const updated = await this.prisma.post.update({
      where: { id },
      data,
    });
    return { updatedAt: updated.updatedAt };
  }

  async publish(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.assertCanModify(post.authorId, userId);
    if (!canTransition(post.status as PostStatus, "published"))
      throw new BadRequestException("Cannot publish from current status");
    await this.prisma.post.update({
      where: { id },
      data: { status: "published", publishedAt: new Date() },
    });
  }

  async schedule(id: string, userId: string, publishAt: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.assertCanModify(post.authorId, userId);
    if (!canTransition(post.status as PostStatus, "scheduled"))
      throw new BadRequestException("Cannot schedule from current status");
    await this.prisma.post.update({
      where: { id },
      data: { status: "scheduled", publishedAt: new Date(publishAt) },
    });
  }

  async archive(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.assertCanModify(post.authorId, userId);
    if (!canTransition(post.status as PostStatus, "archived"))
      throw new BadRequestException("Cannot archive from current status");
    await this.prisma.post.update({
      where: { id },
      data: { status: "archived" },
    });
  }

  async revertToDraft(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.assertCanModify(post.authorId, userId);
    if (!canTransition(post.status as PostStatus, "draft"))
      throw new BadRequestException(
        "Cannot revert to draft from current status",
      );
    await this.prisma.post.update({ where: { id }, data: { status: "draft" } });
  }

  async uploadCover(
    id: string,
    userId: string,
    file: { buffer: Buffer; mimetype: string; size: number },
  ) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException();
    await this.assertCanModify(post.authorId, userId);

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
      throw new UnprocessableEntityException("Invalid file type");
    if (file.size > MAX_FILE_SIZE)
      throw new UnprocessableEntityException("File too large (max 5MB)");

    const ext =
      file.mimetype === "image/png"
        ? ".png"
        : file.mimetype === "image/webp"
          ? ".webp"
          : ".jpg";
    const filename = `${id}${ext}`;
    const coversDir = join(process.cwd(), "uploads", "covers");
    await mkdir(coversDir, { recursive: true });
    await writeFile(join(coversDir, filename), file.buffer);

    await this.prisma.post.update({
      where: { id },
      data: { coverImageKey: filename },
    });
    return { key: filename };
  }

  private async assertCanModify(
    authorId: string,
    requesterId: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: requesterId },
    });
    if (user?.role !== "admin" && authorId !== requesterId)
      throw new ForbiddenException();
  }
}
