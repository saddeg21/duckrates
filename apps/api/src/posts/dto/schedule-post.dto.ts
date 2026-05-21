import { IsDateString } from "class-validator";

export class SchedulePostDto {
  @IsDateString()
  publishAt!: string;
}
