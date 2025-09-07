import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  user: Schema.Types.ObjectId;
  type: 'payment' | 'payout' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  related_entity: {
    type: string,
    id: Schema.Types.ObjectId
  }
}

const transactionSchema: Schema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['payment', 'payout', 'refund'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  related_entity: {
    type: {
      type: String,
      required: true,
      enum: ['Pool', 'Bid']
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'related_entity.type'
    }
  }
}, {
  timestamps: true,
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
