-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN', 'MAINTAINER', 'USER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNCERTAIN');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "refreshToken" TEXT,
    "password" TEXT NOT NULL,
    "firstName" VARCHAR(25) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicy" BOOLEAN NOT NULL DEFAULT false,
    "termOfUse" BOOLEAN NOT NULL DEFAULT false,
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_block" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT DEFAULT '/uploads/user.png',
    "last_login" TIMESTAMP(3),
    "gender" "Gender",
    "address" TEXT,
    "phone" TEXT,
    "langKey" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "brandColor" TEXT NOT NULL DEFAULT '#292929',
    "darkBrandColor" TEXT NOT NULL DEFAULT '#fafafa',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_id_username_email_idx" ON "user"("id", "username", "email");
