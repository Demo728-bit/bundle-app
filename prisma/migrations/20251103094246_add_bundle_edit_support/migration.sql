/*
  Warnings:

  - You are about to drop the column `shopDomain` on the `Bundle` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bundle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundleName" TEXT NOT NULL,
    "mainProductId" TEXT NOT NULL,
    "bundleProducts" TEXT NOT NULL,
    "bundleProductHandles" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Bundle" ("bundleName", "bundleProducts", "createdAt", "id", "mainProductId") SELECT "bundleName", "bundleProducts", "createdAt", "id", "mainProductId" FROM "Bundle";
DROP TABLE "Bundle";
ALTER TABLE "new_Bundle" RENAME TO "Bundle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
