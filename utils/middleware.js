const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('Token: ', request.get('authorization'))
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  let errorMessage = 'Error'
  if (error.name === 'CastError') {
    return response.status(400).send({ 
      error: 'malformatted id' 
    })
  } else if (error.name === 'ValidationError') {
      const errorList = error.errors
      if (errorList.email){
        if (errorList.email.kind === 'unique') {
          errorMessage = 'Email already associated with Existing User'
        }
        else if (errorList.email.kind === 'required') {
          errorMessage = 'Email Required'
        }
      }
      else if (errorList.passwordHash){
        errorMessage = 'Password Required'
      }
      else if (errorList.fname) {
        errorMessage = 'First Name Required'
      }
    console.log(errorMessage)
    return response.status(400).send({ 
      error: errorMessage
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  logger.info(error.message, error.name)
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}