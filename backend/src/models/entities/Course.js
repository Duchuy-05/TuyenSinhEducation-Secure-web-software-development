const { EntitySchema } = require('typeorm');

const CourseFormat = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid'
};

const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

class Course {}

const CourseSchema = new EntitySchema({
  name: 'Course',
  target: Course,
  tableName: 'courses',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  courseGroupId: {
    name: 'course_group_id',
    type: 'varchar',
    length: 255,
    nullable: true
  },
  teacherId: {
    name: 'teacher_id',
    nullable: true,
    type: Number
  },
  category: {
    nullable: true,
    type: String
  },
  title: {
    type: String
  },
  shortDesc: {
    name: 'short_desc',
    type: 'text',
    nullable: true
  },
  target: {
    type: 'text',
    nullable: true
  },
  imageUrl: {
    name: 'image_url',
    nullable: true,
    type: String
  },
  duration: {
    nullable: true,
    type: String
  },
  sessionCount: {
    name: 'session_count',
    nullable: true,
    type: Number
  },
  frequency: {
    nullable: true,
    type: String
  },
  lessonDuration: {
    name: 'lesson_duration',
    nullable: true,
    type: String
  },
  classSize: {
    name: 'class_size',
    nullable: true,
    type: String
  },
  format: {
    type: 'enum',
    enum: CourseFormat,
    default: CourseFormat.ONLINE
  },
  price: {
    type: 'decimal',
    default: 0
  },
  discountPrice: {
    name: 'discount_price',
    type: 'int',
    nullable: true
  },
  status: {
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT
  },
  courseData: {
    name: 'course_data',
    type: 'json',
    nullable: true
  },
  blocks: {
    type: 'json',
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
  teacher: {
    type: 'many-to-one',
    target: () => require('./Teacher.js').Teacher,
    joinColumn: {
      name: 'teacher_id'
    }
  },
  user: {
    type: 'many-to-one',
    target: () => require('./User.js').User,
    joinColumn: {
      name: 'full_name'
    }
  },
  syllabus: {
    type: 'one-to-many',
    target: () => require('./CourseSyllabus.js').CourseSyllabus,
    inverseSide: 'course',
    cascade: true
  },
  registrations: {
    type: 'one-to-many',
    target: () => require('./Registration.js').Registration,
    inverseSide: 'course'
  },
  classes: {
    type: 'one-to-many',
    target: () => require('./Class.js').Class,
    inverseSide: 'course'
  }
},
});

module.exports = { Course, CourseSchema, CourseFormat, CourseStatus };


