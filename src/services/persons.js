import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getAllPersons = () => axios.get(baseUrl);

const createPerson = (newPerson) => axios.post(baseUrl, newPerson);

const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`);

const updatePerson = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson);

export default { getAllPersons, createPerson, deletePerson, updatePerson }