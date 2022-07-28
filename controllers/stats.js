const statsRouter = require('express').Router()
const User = require('../models/user')

statsRouter.post('/updateStats', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ email: body.email }) 
  const newStats = {
    ...user, gamesWon:user.gamesWon++
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