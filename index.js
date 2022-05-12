const express = require('express')
const app = express()

const notes = [
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
	response.json(notes)
})

app.get('/info', (request, response) => {
	const count = notes ? notes.length : 0
	const date = new Date()
	const info = `Phonebook has info for ${count}\n${date}`
	response.end(info)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))