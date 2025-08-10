import mongoose, { Schema, Document } from 'mongoose';

interface IPool extends Document {
  title: string;
  description: string;
  amount: number;
  closingDate: Date;
  location: string;
  creator: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  status: 'open' | 'closed' | 'completed';
}

const poolSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  closingDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    type: String,
    enum: ['open', 'closed', 'completed'],
    default: 'open',
  },
}, {
  timestamps: true,
});

poolSchema.index({ title: 'text', description: 'text' });

const Pool = mongoose.model<IPool>('Pool', poolSchema);

export default Pool;
