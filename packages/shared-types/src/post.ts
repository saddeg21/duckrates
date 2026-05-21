export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export type PostCategory =
  | "AI"
  | "Tech"
  | "Philosophy"
  | "Sociology"
  | "Politics";

export type PostDto = {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostRequest = {
  title: string;
  content: string;
  status: PostStatus;
  authorId: string;
};

export type UpdatePostRequest = Partial<CreatePostRequest> & {
  id: string;
};
