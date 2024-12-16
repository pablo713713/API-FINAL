import mongoose from 'mongoose';
import { getNextSequenceValue } from '../counter/counter.model.js';  // Importar la función desde la carpeta 'counter'

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

// Hook para crear un sobre antes de guardar (asignar un ID secuencial)
envelopeSchema.pre('save', async function(next) {
  if (this.isNew) {
    this._id = await getNextSequenceValue('envelopeId');  // Asignar el ID secuencial
  }
  next();
});

// Hook para crear una transacción antes de guardar (asignar un ID secuencial)
transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    this._id = await getNextSequenceValue('transactionId');  // Asignar el ID secuencial
  }
  next();
});

export const Envelope = mongoose.model('Envelope', envelopeSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema);
