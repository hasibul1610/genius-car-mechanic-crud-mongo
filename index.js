const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();

const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('Connected to database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //GET All data from API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();

            res.send(services);
        })

        //GET single sewrvice
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Getting Specific ID', id);
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);

            res.json(service);
        })

        //POST api
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log('Hitting the post api', service);

            // res.send('Post Hitted')
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)



            // normal scene
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            // const result = await servicesCollection.insertOne(service);

            // console.log(result);
        })

        //DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius server')
})

app.listen(port, () => {
    console.log('Runinng Genius Server on port', port);
})