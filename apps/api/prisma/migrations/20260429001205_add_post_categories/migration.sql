-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
