import express from 'express';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import cors from 'cors';
import Person from './models/person.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

morganBody(app);

app.use((error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError' && error.kind === 'ObjectId') return response.status(400).send({ error: 'Malformatted ID' });
	

	if (error.name === 'ValidationError') return response.status(400).json({ error: error.message });
	
	response.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/api/persons', async (_, response) => {
	try {
		const persons = await Person.find({});
		 console.log('Fetched persons:', persons);
		response.json(persons);
	} catch (error) {
		response.status(500).json({ error: 'Failed to fetch persons' });
	}
});

app.get('/api/persons/:id', async (request, response) => {
  const { id } = request.params;

  try {
	const person = await Person.findById(id);

	if (!person) return response.status(404).json({ error: 'Person not found' });
	
	response.json(person);
	} catch (error) {
		response.status(500).json({ error: 'Failed to fetch person' });
	}
});

app.get('/api/info', async (_, response) => {
	try {
		const count = await Person.countDocuments(); 
	response.send(`
		<p>Phonebook has info for ${count} people.</p>
		<p>${new Date()}</p>
	`);
	} catch (error) {
		response.status(500).json({ error: 'Failed to fetch info' });
	}
});

app.delete('/api/persons/:id', async (request, response) => {
	const { id } = request.params;

	try {
		const person = await Person.findByIdAndDelete(id);

		if (!person) return response.status(404).json({ error: 'Person not found' });
		
		response.status(204).end(); 
	} catch (error) {
		console.error(error);
		response.status(500).json({ error: 'Failed to delete person' });
	}
});

app.post('/api/persons', async (request, response, next) => {
	const { name, number } = request.body;

	try {
		const existingPerson = await Person.findOne({ name });

	if (existingPerson) {
		existingPerson.number = number;
		await existingPerson.save();
		return response.status(200).json(existingPerson);
	}

	const person = new Person({ name, number });
	const savedPerson = await person.save();
	response.status(201).json(savedPerson);

	} catch (error) {
		next(error);
	}
});

app.put('/api/persons/:id', async (request, response, next) => {
  const { id } = request.params;
  const { number } = request.body;

  try {
	const updatedPerson = await Person.findByIdAndUpdate(id, { number }, { new: true, runValidators: true });

	if (!updatedPerson) return response.status(404).json({ error: 'Person not found' });

	response.json(updatedPerson);
	} catch (error) {
		next(error);
	}
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

