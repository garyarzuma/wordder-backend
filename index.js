require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const { OAuth2Client } = require('google-auth-library')
const { config } = require('dotenv')
const client = new OAuth2Client(process.env.CLIENT_ID)
const mongoose = require('mongoose')
const User = require('./models/user')
const MONGODB_URI = process.env.MONGODB_URI
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-01-10T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-01-10T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-01-10T19:20:14.298Z",
    important: true
  }
]


app.use(express.json())
app.use(middleware.requestLogger)

logger.info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post("/api/v1/auth/google", async (req, res, next) => {
    const {token}   = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const { given_name, family_name, name, email, picture } = ticket.getPayload(); 
    const userExist = await User.findOne({ username: email })  

    if (!userExist){
        try{
            const user = new User({
                username: email,
                name: name,
                fname:given_name,
                lname: family_name,
                passwordHash: "none",
                picURL: picture
            })
            const savedUser = await user.save()
            res.status(201)
            res.json(savedUser) 
        }catch (error) {
            next(error)
        }
    }
    else{
        const Existinguser = {
            username: email,
            name: name,
            fname:given_name,
            lname: family_name,
            passwordHash: "none",
            picURL: picture
        }
        const updatedUserInfo = await User.findByIdAndUpdate(userExist._id, Existinguser, { new: true })
        res.json(updatedUserInfo)
    }
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})