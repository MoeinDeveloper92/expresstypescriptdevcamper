import mongoose, { InferSchemaType, Model } from 'mongoose';
import { Bootcamp } from './Bootcamp';

// Define the Schema
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

export interface ICourse
  extends InferSchemaType<typeof CourseSchema>,
    mongoose.Document {}

interface ICourseModel extends Model<ICourse> {
  getAverageCost(
    bootcampId: any
  ): Promise<{ _id: any; averageCost: number } | null>;
}

// Implement the Static Method
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.error(error);
  }
};

CourseSchema.post('save', async function () {
  const course = this;

  if (course.bootcamp) {
    try {
      await Course.getAverageCost(course.bootcamp);
    } catch (err) {
      console.error('Error calculating average cost:', err);
    }
  }
});

CourseSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.model('Courses').getAverageCost(doc.bootcamp);
  }
});

// Create Model with the Interface
const Course = mongoose.model<ICourse, ICourseModel>('Courses', CourseSchema);

export { Course };
