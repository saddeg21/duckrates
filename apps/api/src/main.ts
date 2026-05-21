import "dotenv/config";
import "reflect-metadata";
import { JSDOM } from "jsdom";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { join } from "path";
import { AppModule } from "./app.module";

const { window: jsdomWindow } = new JSDOM("<!DOCTYPE html>");
(globalThis as Record<string, unknown>).document = jsdomWindow.document;
(globalThis as Record<string, unknown>).window = jsdomWindow;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });
  app.useStaticAssets(join(process.cwd(), "uploads"), { prefix: "/uploads" });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in the DTO
      forbidNonWhitelisted: true,
      transform: true, // auto-transform payloads to DTO class instances
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}

bootstrap();
