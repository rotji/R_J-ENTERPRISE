import mongoose, { Schema, Document } from 'mongoose';

export interface IBid extends Document {
  amount: number;
  pool: Schema.Types.ObjectId;
  supplier: Schema.Types.ObjectId;
  status: 'submitted' | 'successful' | 'failed';
}

const bidSchema: Schema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  pool: {
    type: Schema.Types.ObjectId,
    ref: 'Pool',
    required: true,
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['submitted', 'successful', 'failed'],
    default: 'submitted',
  },
}, {
  timestamps: true,
});

const Bid = mongoose.model<IBid>('Bid', bidSchema);

export default Bid;
