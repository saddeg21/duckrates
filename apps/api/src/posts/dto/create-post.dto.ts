import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { PostCategory, POST_CATEGORIES } from "../../common/types";

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsNotEmpty()
  content!: unknown;

  @IsOptional()
  @IsString()
  coverImageKey?: string | null;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v: string) => v.toLowerCase()) : value,
  )
  @IsIn(POST_CATEGORIES, { each: true })
  categories?: PostCategory[];
}
