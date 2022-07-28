const statsRouter = require('express').Router()
const User = require('../models/user')

statsRouter.post('/updateStats', async (request, response) => {
  console.log(request.body)
  const email = request.body.email
  const newGuess = request.body.newGuess
  const user = await User.findOne({email: email}) 
  const newStats = {
    ...user, gamesWon:user.gamesWon++, guessesArray: user.guessesArray.push(newGuess)
  }
  const updatedUserInfo = await User.findByIdAndUpdate(user._id, newStats, { new: true })
  response.json(updatedUserInfo)
})

statsRouter.post('/getStats', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ email: body.email }) 
  response.json(user)
})

module.exports = statsRouter