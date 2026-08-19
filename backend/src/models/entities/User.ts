import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Registration } from './Registration';
import { ClassEnrollment } from './ClassEnrollment';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'google_id', unique: true, nullable: true })
  googleId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: "varchar", length: 6, nullable: true })
  otp: string;

  @Column({ type: "timestamp", nullable: true })
  otpExpiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];

  @OneToMany(() => ClassEnrollment, (enrollment) => enrollment.user)
  enrollments: ClassEnrollment[];
}