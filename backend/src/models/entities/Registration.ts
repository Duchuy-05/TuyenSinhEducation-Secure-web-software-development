import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Course } from './Course';

export enum RegistrationStatus {
  PENDING = 'pending',    
  CONTACTED = 'contacted',  
  CONFIRMED = 'confirmed',   
  CANCELLED = 'cancelled',   
}

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  // Thông tin liên hệ tại thời điểm đăng  (có thể khác với thông tin trong bảng users)
  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  status: RegistrationStatus;

  // Nhân viên xử lý đăng ký
  @Column({ name: 'handled_by', nullable: true })
  handledBy: string;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;

  @Column({ name: 'contacted_at', nullable: true })
  contactedAt: Date;

  @ManyToOne(() => User, (user) => user.registrations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}