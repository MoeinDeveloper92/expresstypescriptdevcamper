import mongoose, { InferSchemaType, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { PrivateKey, Secret } from 'jsonwebtoken';
import crypto from 'crypto';
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please add an email!'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher', 'admin'],
    required: true,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please add a password!'],
    minlength: [6, 'password should be a least 6'],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//~~~~~12mlsadnl123
//Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  const secretKey = process.env.JWT_SECRET;
  // const expiresIn: string = process.env.JWT_EXPIRE || '10d';

  if (!secretKey) {
    throw new Error('JWT Secret is not defieend!');
  }

  return jwt.sign({ _id: this._id?.toString() }, secretKey, {
    expiresIn: '10d',
  });
};

//Match user netered passwor to hashed password in database
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

//Genereate and hash the passowrd Token
UserSchema.methods.getResetPasswordToken = function () {
  //Generate the Token
  //This will give us a buffer them we should convert it to string
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash the token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Set the expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export interface IUser extends InferSchemaType<typeof UserSchema>, Document {
  hashPassword: (password: string) => void;
  getSignedJwtToken: () => string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
}

const User = mongoose.model<IUser>('Users', UserSchema);

export { User };
