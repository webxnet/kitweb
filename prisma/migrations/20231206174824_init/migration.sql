-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MAINTAINER', 'USER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNCERTAIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "firstName" VARCHAR(25),
    "lastName" VARCHAR(50),
    "role" "UserRole" DEFAULT 'USER',
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicy" BOOLEAN NOT NULL,
    "termOfUse" BOOLEAN NOT NULL,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_block" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT DEFAULT '/uploads/user.png',
    "last_login" TIMESTAMP(3) NOT NULL,
    "gender" "Gender",
    "address" TEXT,
    "phone" TEXT,
    "langKey" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "brandColor" TEXT NOT NULL DEFAULT '#292929',
    "darkBrandColor" TEXT NOT NULL DEFAULT '#fafafa',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_username_email_idx" ON "users"("id", "username", "email");
