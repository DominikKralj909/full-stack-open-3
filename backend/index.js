const express = require('express');
const app = express();

app.use(express.json());

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

// Routes
app.get('/api/persons', (_, response) => {
	response.json(persons);
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

app.post('/api/persons', (request, response) => {
	const uniqueId = Math.random().toString(36).substr(2, 9);

	const { name, number } = request.body;

	if (!name) {
		return response.status(400).json({ error: 'Name is missing.' })
	}

	if (!number)  {
		return response.status(400).json({ error: 'Number is missing.' })
	}

	if (persons.find((person) => person.name === name)) {
		return response.status(400).json({error: 'This person already exists in the phonebook.'})
	}

	const newPerson = { id: uniqueId, name: name, number: number };
	persons.push(newPerson);

	response.status(201).json(newPerson);
});

const PORT = '3001';
app.listen(PORT, () => {
	console.log(`App is running on port: ${PORT}`);
});
