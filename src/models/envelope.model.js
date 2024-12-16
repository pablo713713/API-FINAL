import mongoose from 'mongoose';

const envelopeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 }
});


const transactionSchema = new mongoose.Schema({
  envelope_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Envelope' },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const Envelope = mongoose.model('Envelope', envelopeSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
