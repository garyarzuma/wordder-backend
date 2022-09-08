const statsRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { longestStreakCheck } = require('../utils/helperFunctions')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

statsRouter.post('/updateStats/:daily?', async (request, response, next) => {
  try{
    const todaysDate = new Date()
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const newGuess = request.body.newGuess
    const idealGuess = request.body.idealGuess
    /*const user = await User.findOne({email: email}) */
    user.gamesWon = user.gamesWon + 1
    user.guessesArray.push(newGuess) 
    user.idealGuessesArray.push(idealGuess)

    if (request.params.daily === 'daily') {
      user.numberOfDailiesCompleted = user.numberOfDailiesCompleted + 1 
      user.longestStreak =  longestStreakCheck(todaysDate,user.lastDailyDayWon) ? user.longestStreak + 1 : 1
      user.lastDailyDayWon = todaysDate 
    } 
    const updatedUserInfo = await User.findByIdAndUpdate(user._id, user, { new: true })
    response.json(updatedUserInfo)
  } catch (error) {
    next(error)
  }
})

statsRouter.get('/getStats/:email', async (request, response) => {
  const email = request.params.email 
  const user = await User.findOne({ email: email }) 
  response.json(user)
})

module.exports = statsRouter