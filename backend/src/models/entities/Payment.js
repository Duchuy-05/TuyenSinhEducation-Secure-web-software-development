const { EntitySchema } = require('typeorm');

const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  CANCELLED: 'cancelled',
  FAILED: 'failed'
};

const PaymentMethod = {
  PAYOS_AUTO: 'payos_auto',
  ADMIN_MANUAL: 'admin_manual'
};

class Order {}

const OrderSchema = new EntitySchema({
  name: 'Order',
  target: Order,
  tableName: 'orders',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  orderCode: {
    name: 'order_code',
    unique: true,
    type: String
  },
  userId: {
    name: 'user_id',
    type: Number
  },
  courseId: {
    name: 'course_id',
    type: Number
  },
  amount: {
    type: 'int'
  },
  status: {
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  },
  paymentMethod: {
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
    nullable: true
  },
  payosTransactionId: {
    name: 'payos_transaction_id',
    type: 'varchar',
    length: 255,
    nullable: true
  },
  checkoutUrl: {
    name: 'checkout_url',
    type: 'text',
    nullable: true
  },
  qrCodeUrl: {
    name: 'qr_code_url',
    type: 'text',
    nullable: true
  },
  paymentLinkExpiresAt: {
    name: 'payment_link_expires_at',
    type: 'timestamp',
    nullable: true
  },
  paymentNote: {
    name: 'payment_note',
    type: 'text',
    nullable: true
  },
  createdAt: {
    name: 'created_at',
    createDate: true,
    type: 'datetime'
  },
  updatedAt: {
    name: 'updated_at',
    updateDate: true,
    type: 'datetime'
  }
},
  relations: {
  user: {
    type: 'many-to-one',
    target: () => require('./User.js').User,
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'user_id'
    }
  },
  course: {
    type: 'many-to-one',
    target: () => require('./Course.js').Course,
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'course_id'
    }
  }
},
});

module.exports = { Order, OrderSchema, OrderStatus, PaymentMethod };


