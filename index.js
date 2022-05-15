require('dotenv').config()

const express = require('express')
const app = express()

const morgan = require('morgan')
morgan.token('req-body', (request, _) => JSON.stringify(request.body))

const cors = require('cors')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
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

app.get('/api/persons/:id', (request, response, next) => {
	const requestId = request.params.id
	return Person.findById(requestId).then(person => {
		if (!person)
			return response.status(404).end()
		return response.json(person)
	}).catch(error => {
		next(error)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const requestId = request.params.id
	return Person.findByIdAndDelete(requestId).then(person => {
		if (!person)
			return response.status(404).end()
		return response.status(204).end()
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
	const body = request.body
	const update = {
		name: body?.name,
		number: body?.number
	}
	return Person.findByIdAndUpdate(requestId, update, { new: true })
		.then(updatedPerson => {
			if (!updatedPerson)
				return response.status(404).end()
			return response.json(updatedPerson)
	})
})

// errorMiddleware should always be at the end of this file
const errorMiddleware = (error, request, response, next) => {
	console.log('error: ', error)
	if (error.name === 'CastError')
		return response.status(400).json({ error: 'malformed id' })
	next(error)
}
app.use(errorMiddleware)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))