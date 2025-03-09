import mongoose, { InferSchemaType } from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title!'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add course description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add course duration'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bootcamps',
  },
});

export interface ICourse extends InferSchemaType<typeof CourseSchema> {}

const Course = mongoose.model('Courses', CourseSchema);

export { Course };
