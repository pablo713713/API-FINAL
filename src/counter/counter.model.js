import mongoose from 'mongoose';

// Definir el esquema para el contador
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // El _id será el nombre de la secuencia
  seq: { type: Number, default: 0 }      // El contador comenzará en 0
});

// Crear el modelo de Counter
const Counter = mongoose.model('Counter', counterSchema);

// Función para obtener el siguiente valor de secuencia
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },  // Incrementar el valor de 'seq'
    { new: true, upsert: true }  // Crea el documento si no existe
  );

  return sequenceDocument.seq;  // Devuelve el valor actualizado de 'seq'
};

export { Counter, getNextSequenceValue };
