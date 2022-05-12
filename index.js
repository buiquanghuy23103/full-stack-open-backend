const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]

app.get('/api/persons', (request, response) => {
	return response.json(persons)
})

app.get('/info', (request, response) => {
	const count = persons ? persons.length : 0
	const date = new Date()
	const info = `Phonebook has info for ${count} people.\n${date}`
	return response.end(info)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)
	if (!person)
		return response.status(404).end()
	return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(p => p.id === id)
	if (!person)
		return response.status(404).end()
	persons = persons.filter(p => p.id !== id)
	return response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
	const body = request?.body
	if (!body || !body.name || !body.number)
		return response.status(400).json({
			error: 'content missing'
		})
	const alreadyExistPerson = persons.find(p => p.name === body.name)
	if (alreadyExistPerson)
		return response.status(409).json({
			error: 'name must be unique'
		})
	const newId = Math.floor(Math.random() * 10000)
	const newPerson = { ...request.body, id: newId }
	persons = persons.concat(newPerson)
	return response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))