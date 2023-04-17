const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const { response } = require('express')
var ObjectId = require('mongodb').ObjectId
// const ObjectId = require('mongodb').ObjectId

// const { ObjectId } = require('bson')

// const int = 12345

// if (!Number.isInteger(int) || int < 0 || int > 4294967295) {
//   throw new Error('Integer must be within the range of 0 to 4294967295')
// }

// const objectId = new ObjectId(int)

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
// Connection URI and database name
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/?retryWrites=true&w=majority`
// Create a new MongoClient
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
    const adminCollection = client.db('mylibrary').collection('admin')
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
    //get feedback
    app.get('/admin', async (req, res) => {
      const query = {}
      const cursor = adminCollection.find(query)
      const feedback = await cursor.toArray()
      res.json(feedback)
    })
    //post users
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
    //get users by email and password
    app.get('/users', async (req, res) => {
      const query = {}
      const cursor = usersCollection.find(query)
      const feedback = await cursor.toArray()
      res.json(feedback)
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
    //post books
    app.post('/bookDataCollection', async (req, res) => {
      const books = req.body
      console.log(books)
      const result = await bookDataCollection.insertOne(books)
      console.log(result)
      res.json(result)
    })
    // Set Admin role in database
    app.put('/users/admin', async (req, res) => {
      const user = req.body
      console.log(user, 'put')
      const filter = { email: user.email }
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc)
      Console.log(result)
      res.json(result)
    })
    //get users by email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      console.log(query)
      const user = await usersCollection.findOne(query)
      console.log(user)
      let isAdmin = false
      if (user?.role === 'admin') {
        isAdmin = true
      }
      res.json({ admin: isAdmin })
    })
    //get users by email
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      console.log(id, 'deleted')
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.json(result)
    })
    //get single book or specific book
    app.get('/bookDataCollection/:id', async (req, res) => {
      const id = req.params.id
      console.log(id, 'details')
      const query = { _id: new ObjectId(id) }
      console.log(query)
      const detail = await bookDataCollection.findOne(query)
      res.json(detail)
    })
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
