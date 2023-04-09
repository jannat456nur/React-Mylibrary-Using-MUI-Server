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
    const usersCollection = client.db('mylibrary').collection('users')
    const coursesCollection = client.db('mylibrary').collection('course')
    //get book data
    app.get('/bookDataCollection', async (req, res) => {
      const query = {}
      const books = await bookDataCollection.find(query).toArray()
      res.json(books)
    })
    //post feedback
    app.post('/feedback', async (req, res) => {
      const feedback = req.body
      console.log(feedback)
      const result = await feedbackCollection.insertOne(feedback)
      console.log(result)
      res.json(result)
    })
    //get feedback
    app.get('/feedback', async (req, res) => {
      const query = {}
      const cursor = feedbackCollection.find(query)
      const feedback = await cursor.toArray()
      res.json(feedback)
    })
    //get users
    app.post('/users', async (req, res) => {
      const user = req.body
      console.log(user)
      const result = await usersCollection.insertOne(user)
      console.log(result)
      res.json(result)
    })
    //update user info
    app.put('/users', async (req, res) => {
      const user = req.body
      console.log(user)
      const filter = { email: user.email } //work like query
      const options = { upsert: true }
      const updateDoc = { $set: user }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log(result)
      res.json(result)
    })

    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = usersCollection.find(query)
      const feedback = await cursor.toArray()
      res.json(feedback)
    })
    // // Delete COURSE API
    // app.delete('/courses/:id', async (req, res) => {
    //   const id = req.params.id
    //   const query = { _id: ObjectId(id) }
    //   const result = await coursesCollection.deleteOne(query)
    //   res.json(result)
    // })
    app.put('/users/admin/:id', async (req, res) => {
      const user = req.body
      console.log(user)
      const filter = { _id: ObjectId(req.params.id) } //work like query
      const options = { upsert: true }
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log(result)
      res.json(result)
    })
    // Delete FEEDBACK API
    app.delete('/feedback/:id', async (req, res) => {
      const id = req.params.id
      console.log(id, 'deleted')
      const query = { _id: new ObjectId(id) }
      const result = await feedbackCollection.deleteOne(query)
      res.json(result)
    })
    // Delete BOOK API
    app.delete('/bookDataCollection/:id', async (req, res) => {
      const id = req.params.id
      console.log(id, 'deleted')
      const query = { _id: new ObjectId(id) }
      const result = await bookDataCollection.deleteOne(query)
      res.json(result)
    })
    // // Update COURSE API
    // app.put('/users', async (req, res) => {
    //   const user = req.body
    //   console.log('put', user)
    //   const filter = { email: user.email }
    //   const updateDoc = { $set: { role: 'admin' } }
    //   const result = await usersCollection.updateOne(filter, updateDoc)
    //   res.json(result)
    // })
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
