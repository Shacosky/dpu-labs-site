import mongoose, { Schema } from 'mongoose';

const VisitorLogSchema = new Schema(
  {
    path: { type: String, required: true, index: true },
    referrer: { type: String },
    title: { type: String },
    ip: { type: String, required: true, index: true },
    userAgent: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
  },
  { timestamps: true }
);

VisitorLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

export default mongoose.models.VisitorLog ||
  mongoose.model('VisitorLog', VisitorLogSchema);
