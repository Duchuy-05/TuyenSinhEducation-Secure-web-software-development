import { DataSource } from "typeorm";
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

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "trangtuyensinh_db",
    synchronize: true,
    entities: [User, Registration, Course, Teacher, CourseSyllabus, Post, Class, ClassEnrollment, Schedule, Announcement, Order],
})