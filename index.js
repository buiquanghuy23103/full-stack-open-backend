require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
morgan.token('req-body', (request, _) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const Person = require('./models/person')

app.get('/api/persons', (_, response) => {
	return Person.find({}).then(persons => {
		return response.json(persons)
	})
})

app.get('/info', (_, response) => {
	const count = Person.length
	const date = new Date()
	const info = `Phonebook has info for ${count} people.\n${date}`
	return response.end(info)
})

app.get('/api/persons/:id', (request, response) => {
	const requestId = request.params.id
	return Person.findById(requestId).then(person => {
		if (!person)
			return response.status(404).end()
		return response.json(person)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const requestId = request.params.id
	return Person.findByIdAndDelete(requestId).then(person => {
		if (!person)
			return response.status(404).end()
		return response.json(person)
	})
})

app.post('/api/persons/', (request, response) => {
	const body = request?.body
	if (!body || !body.name || !body.number)
		return response.status(400).json({
			error: 'content missing'
		})
	return Person.create(body).then(result => {
		return response.json(result)
	})
})

app.put('/api/persons/:id', (request, response) => {
	const requestId = request.params.id
	const update = request.body
	return Person.findByIdAndUpdate(requestId, update, { new: true })
		.then(updatedPerson => {
			if (!updatedPerson)
				return response.status(404).end()
			return response.json(updatedPerson)
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))