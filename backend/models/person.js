import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch((error) => console.error('Error connecting to MongoDB:', error.message));

const phoneNumberRegex = /^(?:\d{2,3})-\d{6,}$/;

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: [3, 'Name must be at least 3 characters long'],
	},
	number: {
    type: String,
    required: true,
    validate: {
		validator: function(v) {
			return phoneNumberRegex.test(v);
		},
		message: props => `${props.value} is not a valid phone number!`,
    },
  },
});

const Person = mongoose.model('Person', personSchema);

export default Person;
