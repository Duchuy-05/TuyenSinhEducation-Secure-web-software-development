import { AppDataSource } from '../models/DataSource';
import { Registration, RegistrationStatus } from '../models/entities/Registration';

export class RegistrationService {
    private static registrationRepository = AppDataSource.getRepository(Registration);

    static async getAllRegistrations(page: number = 1, limit: number = 10, status?: string) {
        const [registrations, total] = await this.registrationRepository.findAndCount({
            where: status ? { status: status as RegistrationStatus } : {},
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

    static async getRegistrationById(id: number) {
        return this.registrationRepository.findOne({
            where: { id },
            relations: { user: true, course: true },
        });
    }

    static async createRegistration(registrationData: any) {
        const newRegistration = new Registration();
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

    static async updateRegistration(id: number, registrationData: any) {
        const registration = await this.registrationRepository.findOneBy({ id });
        if (!registration) {
            throw new Error('Registration not found');
        }
        Object.assign(registration, registrationData);
        return this.registrationRepository.save(registration);
    }

    static async updateRegistrationStatus(id: number, status: string) {
        await this.registrationRepository.update(id, {
            status: status as RegistrationStatus,
            ...(status === 'contacted' && { contactedAt: new Date() }), //tu dong set date khi status la contacted
        });
        return this.registrationRepository.findOne({ where: { id }, relations: { course: true, user: true } });
    }


    static async deleteRegistration(id: number) {
        const registration = await this.registrationRepository.findOneBy({ id });
        if (!registration) {
            throw new Error('Registration not found');
        }
        return this.registrationRepository.remove(registration);
    }
}
