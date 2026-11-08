"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const User_1 = require("./entities/User");
const Registration_1 = require("./entities/Registration");
const Course_1 = require("./entities/Course");
const Teacher_1 = require("./entities/Teacher");
const CourseSyllabus_1 = require("./entities/CourseSyllabus");
const Post_1 = require("./entities/Post");
const Class_1 = require("./entities/Class");
const ClassEnrollment_1 = require("./entities/ClassEnrollment");
const Schedule_1 = require("./entities/Schedule");
const Announcement_1 = require("./entities/Announcement");
const Payment_1 = require("./entities/Payment");
const migrationsPattern = path_1.default.join(__dirname, "migrations", "*.js").replace(/\\/g, "/");
const databaseUrl = (0, database_1.loadDatabaseUrl)();
const dbType = process.env.DB_TYPE || "mysql";
exports.AppDataSource = new typeorm_1.DataSource({
    type: dbType,
    url: databaseUrl,
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: "migrations",
    migrationsTransactionMode: "none",
    entities: [User_1.UserSchema, Registration_1.RegistrationSchema, Course_1.CourseSchema, Teacher_1.TeacherSchema, CourseSyllabus_1.CourseSyllabusSchema, Post_1.PostSchema, Class_1.ClassSchema, ClassEnrollment_1.ClassEnrollmentSchema, Schedule_1.ScheduleSchema, Announcement_1.AnnouncementSchema, Payment_1.OrderSchema],
    migrations: [migrationsPattern],
});
