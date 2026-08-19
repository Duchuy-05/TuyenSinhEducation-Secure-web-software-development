import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Course } from './Course';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum PaymentMethod {
  PAYOS_AUTO = 'payos_auto',
  ADMIN_MANUAL = 'admin_manual',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'order_code', unique: true })
  orderCode: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payos_transaction_id', type: 'varchar', length: 255, nullable: true })
  payosTransactionId: string;

  @Column({ name: 'checkout_url', type: 'text', nullable: true })
  checkoutUrl: string;

  @Column({ name: 'qr_code_url', type: 'text', nullable: true })
  qrCodeUrl: string;

  @Column({ name: 'payment_link_expires_at', type: 'timestamp', nullable: true })
  paymentLinkExpiresAt: Date;

  @Column({ name: 'payment_note', type: 'text', nullable: true })
  paymentNote: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}