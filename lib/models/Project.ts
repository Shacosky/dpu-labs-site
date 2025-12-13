import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['pentesting', 'audit', 'consulting', 'training'],
      default: 'pentesting',
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['planning', 'in_progress', 'completed', 'on_hold'],
      default: 'planning',
    },
    findings: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 },
    },
    reportGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
