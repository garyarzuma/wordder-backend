const statsRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

statsRouter.post('/updateStats', async (request, response, next) => {
  try{
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    console.log(user)
    const newGuess = request.body.newGuess
    const idealGuess = request.body.idealGuess
    /*const user = await User.findOne({email: email}) */
    const newStats = {
      ...user, 
      gamesWon:user.gamesWon++, 
      guessesArray: user.guessesArray.push(newGuess), 
      idealGuessesArray: user.idealGuessesArray.push(idealGuess)
    }
    const updatedUserInfo = await User.findByIdAndUpdate(user._id, newStats, { new: true })
    response.json(updatedUserInfo)
  } catch (error) {
    next(error)
  }
})

statsRouter.post('/getStats', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ email: body.email }) 
  response.json(user)
})

module.exports = statsRouter