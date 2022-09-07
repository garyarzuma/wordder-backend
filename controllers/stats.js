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

statsRouter.post('/updateStats/:daily', async (request, response, next) => {
  try{
    const todaysDate = new Date()
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
    let newStats = {
      gamesWon:user.gamesWon++, 
      guessesArray: user.guessesArray.push(newGuess), 
      idealGuessesArray: user.idealGuessesArray.push(idealGuess),
      ...user
    }
    console.log(newStats)
    if (request.params.daily === 'daily'){
      newStats = {
        numberOfDailiesCompleted:newStats.numberOfDailiesCompleted++, 
        lastDailyDayWon: todaysDate, 
        longestStreak: longestStreakCheck(todaysDate,newStats.lastDailyDayWon) ? newStats.longestStreak++ : 1,
        ...newStats
      }
      console.log("we are in",newStats)
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