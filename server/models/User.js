import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^05[0-9]{8}$/, 'يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05'],
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor', 'receptionist', 'sales'],
      default: 'sales',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastAssignedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
