import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { loadDatabaseUrl } from "../config/database";
import { User } from "./entities/User";
import { Registration } from "./entities/Registration";
import { Course } from "./entities/Course";
import { Teacher } from "./entities/Teacher";
import { CourseSyllabus } from "./entities/CourseSyllabus";
import { Post } from "./entities/Post";
import { Class } from "./entities/Class";
import { ClassEnrollment } from "./entities/ClassEnrollment";
import { Schedule } from "./entities/Schedule";
import { Announcement } from "./entities/Announcement";
import { Order } from "./entities/Payment";

const isTs = __filename.endsWith(".ts");
const migrationExtension = isTs ? "ts" : "js";
const migrationsPattern = path.join(__dirname, "migrations", `*.${migrationExtension}`).replace(/\\/g, "/");

const databaseUrl = loadDatabaseUrl();
const dbType = (process.env.DB_TYPE as "mysql" | "mariadb") || "mysql";

export const AppDataSource = new DataSource({
    type: dbType,
    url: databaseUrl,
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: "migrations",
    migrationsTransactionMode: "none",
    entities: [User, Registration, Course, Teacher, CourseSyllabus, Post, Class, ClassEnrollment, Schedule, Announcement, Order],
    migrations: [migrationsPattern],
});
