import { z } from 'zod';

// Invoice Validation Schema
export const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50),
  clientId: z.string().min(1, 'Client ID is required'),
  amount: z.number().positive('Amount must be positive'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  description: z.string().min(1, 'Description is required').max(500),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive(),
  })).optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

// Expense Validation Schema
export const ExpenseSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  supplier: z.string().min(1, 'Supplier is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  category: z.enum(['materials', 'services', 'salaries', 'utilities', 'travel', 'other']),
  invoiceNumber: z.string().max(50).optional(),
  paymentMethod: z.enum(['cash', 'check', 'transfer', 'credit_card']).optional(),
  status: z.enum(['pending', 'paid', 'rejected']).optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

// Client Validation Schema
export const ClientSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  rut: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}[-k]$/i, 'Invalid RUT format (XX.XXX.XXX-K)'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).default('Chile'),
  contactPerson: z.string().max(100).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type Client = z.infer<typeof ClientSchema>;

// OSINT Target Validation Schema (plaintext input)
export const OsintTargetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(300),
  aliases: z.array(z.string().max(300)).optional(),
  emails: z.array(z.string().email()).optional(),
  targetType: z.enum(['person', 'company']),
  phones: z.array(z.string().max(50)).optional(),
  urls: z.array(z.string().url()).optional(),
  tags: z.array(z.string().max(50)).optional(),
  notes: z.string().max(5000).optional(),
  sources: z
    .array(
      z.object({
        name: z.string().max(200),
        url: z.string().url().optional(),
        type: z.string().max(100).optional(),
        collectedAt: z.string().optional(),
      })
    )
    .optional(),
});

export type OsintTargetInput = z.infer<typeof OsintTargetSchema>;
