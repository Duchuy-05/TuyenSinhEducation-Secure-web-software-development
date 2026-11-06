const { EntitySchema } = require('typeorm');

class Schedule {}

const ScheduleSchema = new EntitySchema({
  name: 'Schedule',
  target: Schedule,
  tableName: 'schedules',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  classId: {
    name: 'class_id',
    type: Number
  },
  sessionTitle: {
    name: 'session_title',
    type: String
  },
  sessionNumber: {
    name: 'session_number',
    type: 'int'
  },
  startTime: {
    name: 'start_time',
    type: Date
  },
  endTime: {
    name: 'end_time',
    type: Date
  },
  location: {
    nullable: true,
    type: String
  },
  status: {
    type: 'enum',
    enum: [
      'upcoming',
      'ongoing',
      'completed'
    ],
    default: 'upcoming'
  }
},
  relations: {
  class: {
    type: 'many-to-one',
    target: () => require('./Class.js').Class,
    inverseSide: 'schedules',
    joinColumn: {
      name: 'class_id'
    }
  }
},
});

module.exports = { Schedule, ScheduleSchema };


