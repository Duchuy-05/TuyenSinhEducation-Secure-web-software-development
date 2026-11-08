"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const DataSource_1 = require("../models/DataSource");
const Registration_1 = require("../models/entities/Registration");
class RegistrationService {
    static registrationRepository = DataSource_1.AppDataSource.getRepository(Registration_1.Registration);
    static async getAllRegistrations(page = 1, limit = 10, status) {
        const [registrations, total] = await this.registrationRepository.findAndCount({
            where: status ? { status: status } : {},
            relations: { user: true, course: true },
            order: { registeredAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });
        return {
            data: registrations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async getRegistrationById(id) {
        return this.registrationRepository.findOne({
            where: { id },
            relations: { user: true, course: true },
        });
    }
    static async createRegistration(registrationData) {
        const newRegistration = new Registration_1.Registration();
        newRegistration.userId = registrationData.userId;
        newRegistration.courseId = registrationData.courseId;
        newRegistration.contactName = registrationData.contactName;
        newRegistration.contactEmail = registrationData.contactEmail;
        newRegistration.contactPhone = registrationData.contactPhone;
        newRegistration.note = registrationData.note || null;
        newRegistration.status = registrationData.status || 'pending';
        newRegistration.handledBy = registrationData.handledBy || null;
        newRegistration.contactedAt = registrationData.contactedAt || null;
        return this.registrationRepository.save(newRegistration);
    }
    static async updateRegistration(id, registrationData) {
        const registration = await this.registrationRepository.findOneBy({ id });
        if (!registration) {
            throw new Error('Registration not found');
        }
        registration.courseId = registrationData.courseId ?? registration.courseId;
        registration.contactName = registrationData.contactName ?? registration.contactName;
        registration.contactEmail = registrationData.contactEmail ?? registration.contactEmail;
        registration.contactPhone = registrationData.contactPhone ?? registration.contactPhone;
        registration.note = registrationData.note ?? registration.note;
        return this.registrationRepository.save(registration);
    }
    static async updateRegistrationStatus(id, status) {
        await this.registrationRepository.update(id, {
            status: status,
            ...(status === 'contacted' && { contactedAt: new Date() }), //tu dong set date khi status la contacted
        });
        return this.registrationRepository.findOne({ where: { id }, relations: { course: true, user: true } });
    }
    static async deleteRegistration(id) {
        const registration = await this.registrationRepository.findOneBy({ id });
        if (!registration) {
            throw new Error('Registration not found');
        }
        return this.registrationRepository.remove(registration);
    }
}
exports.RegistrationService = RegistrationService;
