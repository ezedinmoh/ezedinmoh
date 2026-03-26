-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[];
