export type Role = "admin" | "author";

export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
