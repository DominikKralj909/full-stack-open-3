import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch((error) => console.error('Error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model('Person', personSchema);

export default Person;
