import { Schema, model, InferSchemaType, Document } from 'mongoose';
import slugify from 'slugify';
import { geocodedAddress } from '../utils/geocoder';

export const BootcampSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name!'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters!'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description!'],
      maxlength: [500, 'Description cannot be longer than 500 characters!'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address!'],
      select: false,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      //Array of strings
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
    averageCost: {
      type: Number,
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//geocode & create location field in DB
BootcampSchema.pre('save', async function (next) {
  const loc = await geocodedAddress(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc.items[0].position.lng, loc.items[0].position.lat],
    formattedAddress: loc.items[0].address.label,
    street: loc.items[0].address.street,
    zipcode: loc.items[0].address.postalCode,
    city: loc.items[0].address.city,
    state: loc.items[0].address.state,
    country: loc.items[0].address.country,
  };
  //Do not save address in DB
  this.set('address', undefined);
  next();
});

//Cascade delete courses when a bootcamp is deleted!
BootcampSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    console.log(`Deleting courses for bootcamp: ${doc._id}`);
    await doc.model('Courses').deleteMany({ bootcamp: doc._id });
  }
});

//reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Courses',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

export interface IBootcamp
  extends InferSchemaType<typeof BootcampSchema>,
    Document {}

export const Bootcamp = model<IBootcamp>('Bootcamps', BootcampSchema);
