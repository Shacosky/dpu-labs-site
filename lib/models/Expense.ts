import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ['materials', 'services', 'salaries', 'utilities', 'travel', 'other'],
      default: 'other',
    },
    invoiceNumber: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'check', 'transfer', 'credit_card'],
      default: 'transfer',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
