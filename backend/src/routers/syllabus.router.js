"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CourseSyllabusController_1 = require("../controllers/CourseSyllabusController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/entities/User");
const validateParam_middleware_1 = require("../middlewares/validateParam.middleware");
const syllabusRouter = (0, express_1.Router)();
syllabusRouter.param('id', validateParam_middleware_1.validatePositiveIntegerParam);
syllabusRouter.get('/syllabi', CourseSyllabusController_1.CourseSyllabusController.getAllSyllabi);
syllabusRouter.get('/syllabi/:id', CourseSyllabusController_1.CourseSyllabusController.getSyllabusById);
syllabusRouter.get('/courses/:courseId/syllabi', CourseSyllabusController_1.CourseSyllabusController.getSyllabusByCourseId);
// bảo mật
syllabusRouter.post('/syllabi', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRoles)(User_1.UserRole.ADMIN), CourseSyllabusController_1.CourseSyllabusController.createSyllabus);
syllabusRouter.put('/syllabi/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRoles)(User_1.UserRole.ADMIN), CourseSyllabusController_1.CourseSyllabusController.updateSyllabus);
syllabusRouter.post('/courses/:courseId/syllabi/bulk', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRoles)(User_1.UserRole.ADMIN), CourseSyllabusController_1.CourseSyllabusController.createSyllabusBulk);
syllabusRouter.put('/courses/:courseId/syllabus', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRoles)(User_1.UserRole.ADMIN), CourseSyllabusController_1.CourseSyllabusController.updateSyllabusBulk);
syllabusRouter.delete('/syllabi/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRoles)(User_1.UserRole.ADMIN), CourseSyllabusController_1.CourseSyllabusController.deleteSyllabus);
exports.default = syllabusRouter;
