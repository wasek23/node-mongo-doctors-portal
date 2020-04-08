const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

// Get
app.get('/', (req, res) => {
    res.send('<a href="/appointments">Appointments</a>');
});
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("patientsDetails").collection("appointments");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(documents);
            }
        });
        client.close();
    });
});

// Post
app.post('/addAppointment', (req, res) => {
    const appointment = req.body;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("patientsDetails").collection("appointments");
        collection.insert(appointment, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            } else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening to port ${port}`));