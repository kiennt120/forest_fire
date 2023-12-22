CREATE TABLE `credential`(
--     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `passwordResetToken` VARCHAR(255) NULL,
    `passwordResetTokenExpries` INT NULL
);

CREATE TABLE `admin`(
    `adminId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

CREATE TABLE `fire`(
    `fireId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cameraId` INT UNSIGNED NULL,
    `type_fire` VARCHAR(255) NOT NULL,
    `status` TINYINT(1) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

CREATE TABLE `email_sended`(
    `eSId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cameraId` INT UNSIGNED NULL,
    `createdAt` DATETIME NOT NULL
);

CREATE TABLE `supervisor`(
    `userId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mSName` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `birthday` DATE NULL,
    `phone` VARCHAR(255) NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

CREATE TABLE `camera`(
    `cameraId` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mSName` VARCHAR(255) NOT NULL,
    `coordinate` VARCHAR(255) NOT NULL,
    `infor` LONGTEXT NULL,
    `status` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(255) NULL UNIQUE,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

CREATE TABLE `monitoring_station`(
--     `mSId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL PRIMARY KEY UNIQUE,
    `city` VARCHAR(255) NULL,
    `district` VARCHAR(255) NULL,
    `ward` VARCHAR(255) NULL,
    `leader` VARCHAR(255) NULL,
    `area` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL
);

ALTER TABLE
    `supervisor` ADD CONSTRAINT `supervisor_mSName_foreign` FOREIGN KEY(`mSName`) REFERENCES `monitoring_station`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    `email_sended` ADD CONSTRAINT `email_sended_cameraid_foreign` FOREIGN KEY(`cameraId`) REFERENCES `camera`(`cameraId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE
    `fire` ADD CONSTRAINT `fire_cameraid_foreign` FOREIGN KEY(`cameraId`) REFERENCES `camera`(`cameraId`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE
    `camera` ADD CONSTRAINT `camera_mSName_foreign` FOREIGN KEY(`mSName`) REFERENCES `monitoring_station`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    `admin` ADD CONSTRAINT `admin_email_foreign` FOREIGN KEY(`email`) REFERENCES `credential`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    `supervisor` ADD CONSTRAINT `supervisor_email_foreign` FOREIGN KEY(`email`) REFERENCES `credential`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;