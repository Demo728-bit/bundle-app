-- CreateTable
CREATE TABLE "Bundle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundleName" TEXT NOT NULL,
    "mainProductId" TEXT NOT NULL,
    "bundleProducts" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
