/*
  Warnings:

  - Added the required column `category` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPublised" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_article" ("content", "id", "isPublised", "name") SELECT "content", "id", "isPublised", "name" FROM "article";
DROP TABLE "article";
ALTER TABLE "new_article" RENAME TO "article";
CREATE UNIQUE INDEX "article_id_key" ON "article"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
