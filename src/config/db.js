import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://coder:coder123@localhost:27017/coder_ecommerce?authSource=admin');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB', error);
    process.exit(1);
  }
};
