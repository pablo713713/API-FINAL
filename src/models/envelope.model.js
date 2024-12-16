import mongoose from 'mongoose';

// Definir el esquema para los sobres
const envelopeSchema = new mongoose.Schema({
  _id: { type: Number, required: true },  // Usar un número como ID
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 }
});

// Definir el esquema para las transacciones
const transactionSchema = new mongoose.Schema({
  envelope_id: { type: Number, ref: 'Envelope' },  // ID numérico del sobre
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const Envelope = mongoose.model('Envelope', envelopeSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
