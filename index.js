const express = require('express')
const ObjectId = require("mongodb").ObjectID;
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
// const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8p0s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




client.connect(err => {
  console.log(err);
  const eventCollection = client.db("shopBD").collection("fruits");
  app.get('/events', (req, res) => {
    eventCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/singleProduct/:id',(req,res)=>{
    eventCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
  })


  app.post('/addFruits', (req, res) => {
    const newEvent = req.body;

    console.log("adding new events", newEvent);
    eventCollection.insertOne(newEvent)
      .then(result => {
        console.log("inserted Count", result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  // client.close();


  app.listen(process.env.PORT || port);
});