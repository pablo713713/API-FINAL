import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb+srv://latorrepablo775:aldiva713@cluster0.x66qq.mongodb.net/budget_db';

mongoose.connect(uri)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(error => console.error('Error de conexión a MongoDB:', error));


export { mongoose };
