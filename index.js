const express = require('express');

//import the hubs-model file
const Hubs = require('./data/hubs-model.js'); // We'll use Hubs to get access to the DB
// Hubs has a find(), findById(), add(), remove(), update() methods
const server = express();

server.use(express.json());
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< add this line to teach express to parse JSON

server.get('/', (req, res) => {
	res.send('<h1>hello web 20.75</h1>');
});

// see a list of Hubs (Channels on Slack) /hubs

server.get('/hubs', (req, res) => {
	// Hubs.find() returns a promise, we need the bros [.then().catch()]
	Hubs.find()
		.then(hubs => {
			// .json will convert the data passed to JSON
			// also tells the client we're sending JSON through the HTTP Header
			res.status(200).json(hubs);
		})
		.catch(error => {
			res.status(500).json({ message: 'error getting the list of hubs' });
		});
});

// create a Hub
server.post('/hubs', (req, res) => {
	const hubInformation = req.body;

	Hubs.add(hubInformation)
		.then(hub => {
			res.status(201).json(hub);
		})
		.catch(err => {
			res.status(500).json({ message: 'error adding the hub' });
		});
});

// delete a Hub /hubs/6
server.delete('/hubs/:id', (req, res) => {
	const hubId = req.params.id;

	Hubs.remove(hubId)
		.then(hub => {
			res.status(200).json({ message: 'Hub deleted successfully' });
		})
		.catch(err => {
			res.status(500).json({ message: 'error deleting the hub' });
		});
});

// update a Hub (if time permits)
server.put('/hubs/:id', (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	Hubs.update(id, changes)
		.then(updated => {
			if (updated) {
				res.status(200).json(updated);
			} else {
				res.status(404).json({ message: 'hub not found' });
			}
		})
		.catch(error => {
			res.status(500).json({ message: 'error updating hub' });
		});
});

const port = 8000;
server.listen(port, () => console.log('api running'));
