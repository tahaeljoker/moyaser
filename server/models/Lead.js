import mongoose from 'mongoose';

const saudiPhoneRegex = /^05[0-9]{8}$/;

const leadSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return saudiPhoneRegex.test(v);
        },
        message: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.',
      },
      index: true,
    },
    unitCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      index: true,
    },
    requestType: {
      type: String,
      required: true,
      enum: ['booking', 'inspection', 'waitlist'],
      default: 'inspection',
      index: true,
    },
    source: {
      type: String,
      enum: ['website', 'walk_in', 'phone', 'whatsapp'],
      default: 'website',
      index: true,
    },
    visitDate: { type: String, default: null, trim: true },
    visitTime: { type: String, default: null, trim: true },
    paymentMethod: { type: String, default: 'تمويل بنكي مدعوم / مرابحة عقارية', trim: true },
    notes: { type: String, default: '', trim: true, maxlength: 1000 },
    nextFollowUpDate: { type: Date, default: null },
    stage: {
      type: String,
      required: true,
      enum: ['prospective', 'reserved', 'closed'],
      default: 'prospective',
      index: true,
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAgentName: { type: String, default: null, trim: true },
    financing: {
      bankName: { type: String, default: '', trim: true },
      depositPaid: { type: Boolean, default: false },
      depositAmount: { type: Number, default: 0 },
      expectedDeedDate: { type: Date, default: null },
    },
    handover: {
      status: {
        type: String,
        enum: ['pending_deed', 'preparing_unit', 'delivered'],
        default: 'pending_deed',
      },
      finalPrice: { type: Number, default: 0 },
      deliveredAt: { type: Date, default: null },
    },
    activityLog: [
      {
        note: { type: String, required: true, trim: true },
        authorName: { type: String, required: true, trim: true },
        authorRole: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

leadSchema.pre('save', async function (next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const lastLead = await mongoose
        .model('Lead')
        .findOne({ ticketNumber: /^MS-\d+$/ })
        .sort({ createdAt: -1 })
        .select('ticketNumber');

      let nextNum = 1001;
      if (lastLead && lastLead.ticketNumber) {
        const parts = lastLead.ticketNumber.split('-');
        const parsed = parseInt(parts[1], 10);
        if (!isNaN(parsed)) nextNum = parsed + 1;
      }
      this.ticketNumber = `MS-${nextNum}`;
    } catch {
      this.ticketNumber = `MS-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
  next();
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
export default Lead;