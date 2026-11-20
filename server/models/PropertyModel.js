import mongoose from 'mongoose';

const propertyModelSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: 'townhouse',
      trim: true,
    },
    area: {
      type: String,
      default: '250 م²',
      trim: true,
    },
    bedrooms: {
      type: Number,
      default: 4,
    },
    bathrooms: {
      type: Number,
      default: 5,
    },
    floors: {
      type: String,
      default: 'دورين وملحق',
      trim: true,
    },
    startingPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    floorPlanImageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    renderImageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const PropertyModel =
  mongoose.models.PropertyModel || mongoose.model('PropertyModel', propertyModelSchema);

export default PropertyModel;