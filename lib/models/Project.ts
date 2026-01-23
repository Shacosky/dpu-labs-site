import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
      features: {
        type: [String],
        default: [],
      },
      useCases: {
        type: [String],
        default: [],
      },
  {
    name: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      default: 'general',
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: false,
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
