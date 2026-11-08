"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1793750400000 = void 0;
class InitialSchema1793750400000 {
    name = 'InitialSchema1793750400000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`course_syllabus\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_id\` int NOT NULL, \`order_index\` int NOT NULL DEFAULT '0', \`title\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`class_id\` int NOT NULL, \`session_title\` varchar(255) NOT NULL, \`session_number\` int NOT NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`location\` varchar(255) NULL, \`status\` enum ('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`class_enrollments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`class_id\` int NOT NULL, \`user_id\` int NOT NULL, \`enrolled_at\` datetime NOT NULL, \`status\` enum ('active', 'completed', 'dropped') NOT NULL DEFAULT 'active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`announcements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`class_id\` int NOT NULL, \`teacher_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`type\` enum ('general', 'urgent', 'homework') NOT NULL DEFAULT 'general', \`is_pinned\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_id\` int NOT NULL, \`teacher_id\` int NOT NULL, \`class_name\` varchar(255) NOT NULL, \`start_date\` datetime NOT NULL, \`end_date\` datetime NULL, \`max_students\` int NOT NULL DEFAULT '30', \`status\` enum ('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teachers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`title\` varchar(255) NULL, \`experience\` varchar(255) NULL, \`company\` varchar(255) NULL, \`specialization\` varchar(255) NULL, \`bio\` text NULL, \`avatar_url\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`IDX_7568c49a630907119e4a665c60\` (\`email\`), UNIQUE INDEX \`REL_4668d4752e6766682d1be0b346\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`course_group_id\` varchar(255) NULL, \`teacher_id\` int NULL, \`category\` varchar(255) NULL, \`title\` varchar(255) NOT NULL, \`short_desc\` text NULL, \`target\` text NULL, \`image_url\` varchar(255) NULL, \`duration\` varchar(255) NULL, \`session_count\` int NULL, \`frequency\` varchar(255) NULL, \`lesson_duration\` varchar(255) NULL, \`class_size\` varchar(255) NULL, \`format\` enum ('online', 'offline', 'hybrid') NOT NULL DEFAULT 'online', \`price\` decimal NOT NULL DEFAULT '0', \`discount_price\` int NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`course_data\` json NULL, \`blocks\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`full_name\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`registrations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`course_id\` int NOT NULL, \`contact_name\` varchar(255) NOT NULL, \`contact_email\` varchar(255) NOT NULL, \`contact_phone\` varchar(255) NOT NULL, \`note\` text NULL, \`status\` enum ('pending', 'contacted', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending', \`handled_by\` varchar(255) NULL, \`registered_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`contacted_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`password_hash\` varchar(255) NULL, \`avatar_url\` varchar(255) NULL, \`google_id\` varchar(255) NULL, \`role\` enum ('student', 'admin', 'teacher') NOT NULL DEFAULT 'student', \`isVerified\` tinyint NOT NULL DEFAULT 0, \`otp\` varchar(6) NULL, \`otpExpiresAt\` timestamp NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_0bd5012aeb82628e07f6a1be53\` (\`google_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`thumbnail_url\` varchar(255) NULL, \`short_desc\` text NULL, \`content\` longtext NOT NULL, \`author_name\` varchar(255) NULL, \`status\` enum ('draft', 'published') NOT NULL DEFAULT 'draft', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_54ddf9075260407dcfdd724857\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_code\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`course_id\` int NOT NULL, \`amount\` int NOT NULL, \`status\` enum ('pending', 'paid', 'cancelled', 'failed') NOT NULL DEFAULT 'pending', \`payment_method\` enum ('payos_auto', 'admin_manual') NULL, \`payos_transaction_id\` varchar(255) NULL, \`checkout_url\` text NULL, \`qr_code_url\` text NULL, \`payment_link_expires_at\` timestamp NULL, \`payment_note\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e462c2f2237b3049aa6be3fce0\` (\`order_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_syllabus\` ADD CONSTRAINT \`FK_1bfef8bf6979474f0d5fd22f2e2\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedules\` ADD CONSTRAINT \`FK_96d9e884d615df87013aefbdf21\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_enrollments\` ADD CONSTRAINT \`FK_dfd6aaba34336d3c77b06c5038c\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`class_enrollments\` ADD CONSTRAINT \`FK_3e55346a50b96acf9006b4e8f15\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD CONSTRAINT \`FK_8adc55f739d19d84f29e5ffcfb4\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`announcements\` ADD CONSTRAINT \`FK_a86942064f1e5eeb3bc8a84cb4a\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_bd4c6c725acd427f07264770ceb\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_b34c92e413c4debb6e0f23fed46\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teachers\` ADD CONSTRAINT \`FK_4668d4752e6766682d1be0b346f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_fad76a730ee7f68d0a59652fb12\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_0604efbe0bd6c30c83ec7d2f56e\` FOREIGN KEY (\`full_name\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_6aacc9b213fd8c881af6c738ecf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`registrations\` ADD CONSTRAINT \`FK_27b8078915da815931f5bf0faaa\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_8f64e2f0728bad0f6c6aa6413b2\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_8f64e2f0728bad0f6c6aa6413b2\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_27b8078915da815931f5bf0faaa\``);
        await queryRunner.query(`ALTER TABLE \`registrations\` DROP FOREIGN KEY \`FK_6aacc9b213fd8c881af6c738ecf\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_0604efbe0bd6c30c83ec7d2f56e\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_fad76a730ee7f68d0a59652fb12\``);
        await queryRunner.query(`ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_4668d4752e6766682d1be0b346f\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_b34c92e413c4debb6e0f23fed46\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_bd4c6c725acd427f07264770ceb\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP FOREIGN KEY \`FK_a86942064f1e5eeb3bc8a84cb4a\``);
        await queryRunner.query(`ALTER TABLE \`announcements\` DROP FOREIGN KEY \`FK_8adc55f739d19d84f29e5ffcfb4\``);
        await queryRunner.query(`ALTER TABLE \`class_enrollments\` DROP FOREIGN KEY \`FK_3e55346a50b96acf9006b4e8f15\``);
        await queryRunner.query(`ALTER TABLE \`class_enrollments\` DROP FOREIGN KEY \`FK_dfd6aaba34336d3c77b06c5038c\``);
        await queryRunner.query(`ALTER TABLE \`schedules\` DROP FOREIGN KEY \`FK_96d9e884d615df87013aefbdf21\``);
        await queryRunner.query(`ALTER TABLE \`course_syllabus\` DROP FOREIGN KEY \`FK_1bfef8bf6979474f0d5fd22f2e2\``);
        await queryRunner.query(`DROP INDEX \`IDX_e462c2f2237b3049aa6be3fce0\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP INDEX \`IDX_54ddf9075260407dcfdd724857\` ON \`posts\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP INDEX \`IDX_0bd5012aeb82628e07f6a1be53\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`registrations\``);
        await queryRunner.query(`DROP TABLE \`courses\``);
        await queryRunner.query(`DROP INDEX \`REL_4668d4752e6766682d1be0b346\` ON \`teachers\``);
        await queryRunner.query(`DROP INDEX \`IDX_7568c49a630907119e4a665c60\` ON \`teachers\``);
        await queryRunner.query(`DROP TABLE \`teachers\``);
        await queryRunner.query(`DROP TABLE \`classes\``);
        await queryRunner.query(`DROP TABLE \`announcements\``);
        await queryRunner.query(`DROP TABLE \`class_enrollments\``);
        await queryRunner.query(`DROP TABLE \`schedules\``);
        await queryRunner.query(`DROP TABLE \`course_syllabus\``);
    }
}
exports.InitialSchema1793750400000 = InitialSchema1793750400000;
