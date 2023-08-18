import { model, Schema } from 'mongoose';

interface IAI {
  question: string;
  answer: string;
}

const aiSchema = new Schema<IAI>(
  {
    question: {
      type: String,
      min: 1,
      max: 10000,
      unique: true,
      required: true,
    },
    answer: {
      type: String,
      min: 1,
      max: 10000,
      unique: true,
    },
  },
  { timestamps: true },
);

const AI = model<IAI>('ai', aiSchema);

export default AI;
