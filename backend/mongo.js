import mongoose from 'mongoose';

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (!password) {
  console.log('Please provide a password as the first argument.');
  process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@phonebook.vrf19.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Phonebook`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (!name || !number) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {

  const person = new Person({ name, number });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
