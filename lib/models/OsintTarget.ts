import mongoose, { Schema, Types } from 'mongoose';

type Enc = {
  iv: string;
  tag: string;
  ct: string;
  alg: 'AES-256-GCM';
  kver: number;
};

const EncSchema = new Schema<Enc>(
  {
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    ct: { type: String, required: true },
    alg: { type: String, enum: ['AES-256-GCM'], required: true },
    kver: { type: Number, required: true },
  },
  { _id: false }
);

const OsintTargetSchema = new Schema(
  {
    targetType: {
      type: String,
      enum: ['person', 'company'],
      required: true,
      index: true,
    },
    ownerId: { type: String, required: true, index: true },
    nameHash: { type: String, required: true, index: true },
    nameEnc: { type: EncSchema, required: true },
    aliasesEnc: { type: EncSchema, required: false },
    emailsEnc: { type: EncSchema, required: false },
    phonesEnc: { type: EncSchema, required: false },
    urlsEnc: { type: EncSchema, required: false },
    tagsEnc: { type: EncSchema, required: false },
    notesEnc: { type: EncSchema, required: false },
    sourcesEnc: { type: EncSchema, required: false },
  },
  { timestamps: true }
);

OsintTargetSchema.index({ ownerId: 1, nameHash: 1 }, { unique: true });

export default mongoose.models.OsintTarget || mongoose.model('OsintTarget', OsintTargetSchema);
