const mongoose = require('mongoose')

if (process.argv.length < 3)
{
	console.log('Please provide password as an argument:',
					'node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://huybui:${password}@cluster0.euw0y.mongodb.net`
				+ "/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(url)

const closeDb = () => mongoose.connection.close()

const personSchema = new mongoose.Schema({
	id: Number,
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

const newPerson = new Person({
	name: process.argv[3],
	number: process.argv[4]
})

newPerson.save().then(result => {
	console.log(`added ${result.name} number ${result.number} to phonebook`)
	closeDb()
})