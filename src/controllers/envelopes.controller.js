import { Envelope, Transaction } from '../models/envelope.model.js';
import { mongoose } from '../db.js';

/**
 * Obtener el siguiente ID para un sobre
 */
const getNextSequenceValue = async (sequenceName) => {
  const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
    { _id: sequenceName },  // Encuentra el documento del contador de sobres
    { $inc: { seq: 1 } },    // Incrementa el contador
    { returnDocument: 'after', upsert: true }  // Si no existe, lo crea
  );
  return counter.value.seq;  // Devuelve el nuevo valor de ID
};
/**
 * Obtener todos los sobres (envelopes)
 */
export const getAllEnvelopes = async (req, res) => {
  if (!mongoose.connection.readyState) {
    return res.status(500).json({ message: 'Error: No conectado a la base de datos' });
  }

  try {
    console.log('Conectando a la base de datos...');
    const envelopes = await Envelope.find();  // Aquí es donde ocurre el posible error
    console.log('Sobres encontrados:', envelopes);
    res.json({ envelopes });
  } catch (error) {
    console.error('Error en getAllEnvelopes:', error.message);  // Muestra detalles del error
    res.status(500).json({ message: 'Error al obtener los sobres' });
  }
};


/**
 * Obtener un sobre específico por su ID
 */
export const getEnvelopeById = async (id) => {
  try {
    const envelope = await Envelope.findById(id);
    if (!envelope) throw new Error(`Sobre con ID ${id} no encontrado`);
    return envelope;
  } catch (error) {
    throw new Error('Error al obtener el sobre');
  }
};

/**
 * Crear un nuevo sobre (envelope)
 */
export const createEnvelope = async (req, res) => {
  const { name, limit } = req.body;
  
  try {
    // Obtener el siguiente ID
    const newId = await getNextSequenceValue('envelopeId');
    
    // Crear el nuevo sobre con el ID numérico
    const newEnvelope = new Envelope({ _id: newId, name, limit, spent: 0 });
    await newEnvelope.save();

    res.status(201).json(newEnvelope);
  } catch (error) {
    console.error('Error al crear el sobre:', error);
    res.status(500).json({ message: 'Error al crear el sobre' });
  }
};

/**
 * Obtener las transacciones para un sobre
 */
export const getTransactionsForEnvelope = async (envelopeId) => {
  try {
    const transactions = await Transaction.find({ envelope_id: envelopeId });
    return transactions.length === 0 ? [] : transactions;
  } catch (error) {
    throw new Error('Error al obtener las transacciones para el sobre');
  }
};

/**
 * Realizar una transacción en un sobre
 */
export const makeTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;

  try {
    const envelope = await Envelope.findById(id);
    if (!envelope) {
      return res.status(404).json({ message: `Sobre con ID ${id} no encontrado` });
    }

    // Verificar si la transacción excede el límite
    if (envelope.spent + amount > envelope.limit) {
      return res.status(403).json({ message: 'La transacción excede el límite del sobre' });
    }

    // Realizar la transacción
    const newTransaction = new Transaction({ envelope_id: id, amount, description });
    await newTransaction.save();

    // Actualizar el monto gastado en el sobre
    envelope.spent += amount;
    await envelope.save();

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error al realizar la transacción' });
  }
};
