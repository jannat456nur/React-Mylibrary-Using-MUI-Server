const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})
console.log(uri)

async function run() {
  try {
    await client.connect()
    console.log('connected to db')

    const bookDataCollection = client.db('mylibrary').collection('bookData')
    const feedbackCollection = client.db('mylibrary').collection('feedback')

    app.get('/bookDataCollection', async (req, res) => {
      const query = {}
      const books = await bookDataCollection.find(query).toArray()
      res.json(books)
    })

    app.post('/feedback', async (req, res) => {
      const feedback = req.body
      console.log(feedback)
      const result = await feedbackCollection.insertOne(feedback)
      console.log(result)
      res.json(result)
    })
    app.get('/feedback', async (req, res) => {
      const query = {}
      const cursor = feedbackCollection.find(query)
      const feedback = await cursor.toArray()
      res.json(feedback)
    })

    // app.get("/doctors/:email", async (req, res) => {
    //   const {email} = req.params;
    //   const cursor = doctorsCollection.find({email});
    //   const doctor = await cursor.toArray();
    //   res.json(doctor);
    // });
    // // User sending to db

    // // User upsert function
    // app.put("/users", async (req, res) => {
    //   const user = req.body;
    //   const filter = { email: user.email };
    //   const options = { upsert: true }; //used for upsert = uodate if exist else post
    //   const updateDoc = { $set: user };
    //   const result = await usersCollection.updateOne(filter,updateDoc,options);
    //   res.json(result);
    // });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
