const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.odwvb.mongodb.net/movieHall?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const eventsCollections = client.db('movieHall').collection('movielist');
	app.patch('/UpdateAvailable/:id', (req, res) => {
		console.log(req.params.id);
		console.log(req.body.available);
		eventsCollections
			.updateOne(
				{ _id: ObjectID(req.params.id) },
				{
					$set: {
						available: req.body.available,
					},
				}
			)
			.then((result, err) => console.log(err));
	});
	app.post('/toDayMovie', (req, res) => {
		const date = req.body.date;
		eventsCollections.find({ date: date }).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/getSpecificMovie/:key', (req, res) => {
		eventsCollections
			.find({
				_id: ObjectID(req.params.key),
			})
			.toArray((err, docs) => {
				res.send(docs[0]);
			});
	});
	app.get('/getAllMovie', (req, res) => {
		eventsCollections.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
	//add movie in database
	app.post('/addmovie', (req, res) => {
		const newmovie = req.body;
		movieCollection.insertOne(newmovie).then((result) => {
			res.send(result.insertedCount > 0);
		});
	});
	//get specific events
	app.get('/getEvent/:id', (req, res) => {
		const taskId = parseInt(req.params.id);
		eventsCollections.find({ id: taskId }).toArray((err, documents) => {
			res.send(documents[0]);
		});
	});
	// get all movie
	app.get('/getmovieData', (req, res) => {
		eventsCollections.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port);
