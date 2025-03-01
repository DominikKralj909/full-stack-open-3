import personService from '../services/persons'

export const Persons = ({ filteredPersons, setPersons }) => {	
	const handlePersonDelete = async (id, name) => {
		const isConfirmed = window.confirm(`Delete ${name}?`);
		
		if (!isConfirmed) return;

		try {
			await personService.deletePerson(id);
			console.log(`${name} deleted successfully`);

			setPersons(filteredPersons.filter(person => person.id !== id));
		} catch (error) {
			console.error('Error deleting person:', error);
		}
	}

	return filteredPersons.length === 0 ? 'No persons found' : filteredPersons.map(({ name, number, id }) => (
		<div key={id}>
			<div>{name} - {number}</div>
			<button onClick={() => handlePersonDelete(id, name)}>Delete</button>
		</div>
	));
}
