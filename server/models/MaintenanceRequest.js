import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      required: true,
      trim: true,
    },
    projectName: {
      type: String,
      default: '',
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'scheduled', 'inprogress', 'done', 'cancelled'],
      default: 'new',
    },
    verificationStatus: {
      type: String,
      enum: ['unconfirmed', 'confirmed'],
      default: 'unconfirmed',
    },
    appointmentDate: {
      type: Date,
      default: null,
    },
    appointmentNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MaintenanceRequest =
  mongoose.models.MaintenanceRequest ||
  mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

export default MaintenanceRequest;
