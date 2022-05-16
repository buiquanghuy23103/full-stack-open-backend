
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	id: String,
	name: {
		type: String,
		minlength: 5,
		required: true
	},
	number: {
		type: String,
		required: true
	}
})

personSchema.set('toJSON', {
	transform: (doc, returnedObj) => {
		returnedObj.id = doc._id.toString()
		delete returnedObj._id
		delete returnedObj.__v
	}
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person