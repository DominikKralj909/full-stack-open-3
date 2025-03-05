import { useState, useEffect } from 'react';

import personServices from './services/persons';

import { Filter } from './components/Filter';
import { PersonForm } from './components/PersonForm';
import { Persons } from './components/Persons';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [searchedName, setSearchedName] = useState('');
	const [addedPerson, setAddedPerson] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const fetchPeople = async () => {
		try {
			const response = await personServices.getAllPersons();
			setPersons(response.data);
		} catch (error) {
			console.error('Error fetching people:', error);
		}
	};

	useEffect(() => {
		fetchPeople();
	}, []);

	const handleNameChange = (event) => setNewName(event.target.value);
	const handleNumberChange = (event) => setNewNumber(event.target.value);
	const handleNameSearch = (event) => setSearchedName(event.target.value);

	const handlePersonSubmit = async (event) => {
		event.preventDefault();

		if (newName.trim() === '' || newNumber.trim() === '') {
			alert(`Please enter both name and number`);
			return;
		}

		if (newName.trim().length < 3) {
			setErrorMsg('Name must be atleast 3 characters long');
		}

		const phoneRegex = /^[0-9]{2,3}-[0-9]+$/;

		if (!phoneRegex.test(newNumber)) {
			setErrorMsg('Phone number must be in the format of XX-XXXXXXX or XXX-XXXXXXX');
			return;
		}

		const existingPerson = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

		if (existingPerson) {
			const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);

			if (confirmUpdate) {
				const updatedPerson = { ...existingPerson, number: newNumber };

				try {
					const { data } = await personServices.updatePerson(existingPerson._id, updatedPerson);

					setPersons(persons.map((person) => person._id === existingPerson._id ? data : person));
					setNewName('');
					setNewNumber('');
					fetchPeople();
				} catch (error) {
					console.error('Error updating person:', error);
					setErrorMsg(`Information of ${newName} has already been removed from the server`);
				}
			}
		} else {
			try {
				const { data } = await personServices.createPerson({ name: newName, number: newNumber });

				setPersons([...persons, data]);
				setNewName('');
				setNewNumber('');
				setAddedPerson(newName);
			} catch (error) {
				console.error('Error adding person:', error);
			}
		}
	};

	const filteredPersons = persons?.filter(({ name }) => name?.toLowerCase().includes(searchedName.toLowerCase()));

	return (
		<div>
			<h2>Phonebook</h2>
			{addedPerson && <div className="added-person">{`Added ${addedPerson}`}</div>}
			{errorMsg && <div className="error">{errorMsg}</div>}
			<Filter searchedName={searchedName} onNameSearch={handleNameSearch} />
			<h3>Add a new person</h3>
			<PersonForm
				newName={newName}
				newNumber={newNumber}
				onPersonSubmit={handlePersonSubmit}
				onNameChange={handleNameChange}
				onNumberChange={handleNumberChange}
			/>
			<h2>Numbers</h2>
			<Persons filteredPersons={filteredPersons} setPersons={setPersons} />
		</div>
	);
};

export default App;
