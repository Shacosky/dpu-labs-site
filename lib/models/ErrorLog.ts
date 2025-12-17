import mongoose, { Schema } from 'mongoose';

const ErrorLogSchema = new Schema(
  {
    userId: { type: String, index: true },
    type: {
      type: String,
      enum: ['react_error', 'api_error', 'network_error', 'validation_error', 'unknown'],
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    stack: { type: String },
    componentStack: { type: String },
    url: { type: String },
    method: { type: String },
    statusCode: { type: Number },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed },
    resolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

ErrorLogSchema.index({ createdAt: -1 });
ErrorLogSchema.index({ type: 1, resolved: 1 });

export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', ErrorLogSchema);
