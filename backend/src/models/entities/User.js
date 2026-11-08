const { EntitySchema } = require('typeorm');

const UserRole = {
  STUDENT: 'student',
  ADMIN: 'admin',
  TEACHER: 'teacher'
};

class User {}

const UserSchema = new EntitySchema({
  name: 'User',
  target: User,
  tableName: 'users',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  fullName: {
    name: 'full_name',
    type: String
  },
  email: {
    unique: true,
    type: String
  },
  phone: {
    nullable: true,
    type: String
  },
  passwordHash: {
    name: 'password_hash',
    nullable: true,
    type: String
  },
  avatarUrl: {
    name: 'avatar_url',
    nullable: true,
    type: String
  },
  googleId: {
    name: 'google_id',
    unique: true,
    nullable: true,
    type: String
  },
  role: {
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT
  },
  isVerified: {
    default: false,
    type: Boolean
  },
  otp: {
    type: 'varchar',
    length: 6,
    nullable: true
  },
  otpExpiresAt: {
    type: 'timestamp',
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
  registrations: {
    type: 'one-to-many',
    target: () => require('./Registration.js').Registration,
    inverseSide: 'user'
  },
  enrollments: {
    type: 'one-to-many',
    target: () => require('./ClassEnrollment.js').ClassEnrollment,
    inverseSide: 'user'
  }
},
});

module.exports = { User, UserSchema, UserRole };


