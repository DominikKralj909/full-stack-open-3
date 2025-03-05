import express from 'express';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Person from './models/person.js';

const persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

morganBody(app);

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

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);

	if (!person) response.status(404).send('No person is found with this id.');

	response.json(person);
});

app.get('/api/info', (_, response) => {
	response.send(`
		<p>Phonebook has info for ${persons.length} people.</p>
		<p>${new Date()}</p>
	`);
});

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const person = persons.filter((person) => person.id !== id);

	response.json(person);
});

app.post('/api/persons', async (request, response) => {
	const { name, number } = request.body;

	if (!name || !number) {
		return response.status(400).json({ error: 'Name and number are required' });
	}

	try {
		const newPerson = new Person({ name, number });
		const savedPerson = await newPerson.save();
		response.status(201).json(savedPerson);
	} catch (error) {
		response.status(500).json({ error: 'Failed to save person' });
	}
});

app.put('/api/persons/:id', (request, response) => {
	const id = request.params.id;
	const { number } = request.body;

	const personToUpdate = persons.find((person) => person.id === id);

	personToUpdate.number = number;

	response.json(personToUpdate)

});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

