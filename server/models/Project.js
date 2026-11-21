import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    tagline: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    district: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['available', 'under_development', 'completed', 'upcoming'],
      default: 'available',
      index: true,
    },
    heroImageUrl: { type: String, default: '', trim: true },
    heroVideoUrl: { type: String, default: '', trim: true },
    tour3dUrl: { type: String, default: '', trim: true },
    masterplanUrl: { type: String, default: '', trim: true },
    galleryImages: [{ url: String, title: String, category: String }],
    contactPhone: { type: String, default: '', trim: true },
    whatsappNumber: { type: String, default: '', trim: true },
    mapUrl: { type: String, default: '', trim: true },
    regaLicense: { type: String, default: '', trim: true },
    valLicense: { type: String, default: '', trim: true },
    landmarks: [{ label: String, minutes: Number, nearby: String }],
    specs: [{ type: String, trim: true }],
    guarantees: [{ title: String, duration: String, details: String }],
    afterSales: [{ type: String, trim: true }],
    visibleSections: {
      models: { type: Boolean, default: true },
      unitMatrix: { type: Boolean, default: true },
      gallery: { type: Boolean, default: true },
      location: { type: Boolean, default: true },
      specs: { type: Boolean, default: true },
      guarantees: { type: Boolean, default: true },
      afterSales: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
