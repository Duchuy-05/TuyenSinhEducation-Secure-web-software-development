import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CourseSyllabus } from './CourseSyllabus';
import { Registration } from './Registration';
import { Teacher} from './Teacher';
import { Class } from './Class';
import { User } from './User';

export enum CourseFormat {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // định danh chung để gom bản draft và public để sau này cập nhật khóa học
  @Column({ name: 'course_group_id', type: 'varchar', length: 255, nullable: true})
  courseGroupId: string;

  @Column({ name: 'teacher_id', nullable: true })
  teacherId: number;

  @Column({ nullable: true })
  category: string;

  @Column()
  title: string;

  @Column({ name: 'short_desc', type: 'text', nullable: true })
  shortDesc: string;

  @Column({ type: 'text', nullable: true })
  target: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ name: 'session_count', nullable: true })
  sessionCount: number;

  @Column({ nullable: true })
  frequency: string;

  @Column({ name: 'lesson_duration', nullable: true })
  lessonDuration: string;

  @Column({ name: 'class_size', nullable: true })
  classSize: string;

  @Column({
    type: 'enum',
    enum: CourseFormat,
    default: CourseFormat.ONLINE,
  })
  format: CourseFormat;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({ name: 'discount_price', type: 'int', nullable: true})
  discountPrice: number;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;
  
  @Column({ name: 'course_data', type: 'json', nullable: true })
  courseData: any;

  @Column({ type: 'json', nullable: true })
  blocks: any;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name : 'teacher_id'})
  teacher: Teacher;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'full_name' }) 
  user: User;

  @OneToMany(() => CourseSyllabus, (syllabus) => syllabus.course, {
    cascade: true,
  })
  syllabus: CourseSyllabus[];

  @OneToMany(() => Registration, (registration) => registration.course)
  registrations: Registration[];

  @OneToMany(() => Class, (cls) => cls.course)
  classes: Class[];
}

