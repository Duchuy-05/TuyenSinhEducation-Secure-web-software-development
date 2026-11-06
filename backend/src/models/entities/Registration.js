const { EntitySchema } = require('typeorm');

const RegistrationStatus = {
  PENDING: 'pending',
  CONTACTED: 'contacted',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

class Registration {}

const RegistrationSchema = new EntitySchema({
  name: 'Registration',
  target: Registration,
  tableName: 'registrations',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  userId: {
    name: 'user_id',
    nullable: true,
    type: Number
  },
  courseId: {
    name: 'course_id',
    type: Number
  },
  contactName: {
    name: 'contact_name',
    type: String
  },
  contactEmail: {
    name: 'contact_email',
    type: String
  },
  contactPhone: {
    name: 'contact_phone',
    type: String
  },
  note: {
    type: 'text',
    nullable: true
  },
  status: {
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING
  },
  handledBy: {
    name: 'handled_by',
    nullable: true,
    type: String
  },
  registeredAt: {
    name: 'registered_at',
    createDate: true,
    type: 'datetime'
  },
  contactedAt: {
    name: 'contacted_at',
    nullable: true,
    type: Date
  }
},
  relations: {
  user: {
    type: 'many-to-one',
    target: () => require('./User.js').User,
    inverseSide: 'registrations',
    nullable: true,
    onDelete: 'SET NULL',
    joinColumn: {
      name: 'user_id'
    }
  },
  course: {
    type: 'many-to-one',
    target: () => require('./Course.js').Course,
    inverseSide: 'registrations',
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'course_id'
    }
  }
},
});

module.exports = { Registration, RegistrationSchema, RegistrationStatus };


