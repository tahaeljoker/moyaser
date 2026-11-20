import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema(
  {
    unitCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['townhouse', 'apartment'],
      default: 'townhouse',
      index: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    facade: {
      type: String,
      default: 'شمالية عصرية',
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
      index: true,
    },
    floorPlanSpecs: {
      builtArea: { type: Number, default: 0 },
      extraArea: { type: Number, default: 0 },
      totalArea: { type: Number, default: 0 },
      floors: { type: String, default: '' },
      rooms: { type: String, default: '' },
      baths: { type: Number, default: 0 },
    },
    media: {
      images: { type: [String], default: [] },
      videoUrl: { type: String, default: '', trim: true },
      tour3dUrl: { type: String, default: '', trim: true },
    },
  },
  {
    timestamps: true,
  }
);

export const Unit = mongoose.models.Unit || mongoose.model('Unit', unitSchema);
export default Unit;