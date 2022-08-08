require('dotenv').config()
const https = require('https');
const fs = require('fs');
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const facebookRouter = require('./controllers/facebookLogin')
const googleRouter = require('./controllers/googleLogin')
const statsRouter = require('./controllers/stats')

const options = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt'),
  };

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

app.use('/api/login', loginRouter)
app.use('/api/login/facebookLogin', facebookRouter)
app.use('/api/login/v1/auth/google', googleRouter)
app.use('/api/stats', statsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3001
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})