const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const saltRounds = 10

loginRouter.post('/wordderLogin/signup', async (request, response, next) => {
  const body = request.body
  console.log("signinup")
  bcrypt.hash(body.password, saltRounds, async function(err, hash) {
    try{
      const user = new User({
          email: body.email,
          fname: body.fname,
          lname: body.lname,
          passwordHash: hash,
      })
      console.log(user)
      const savedUser = await user.save()
      response
      .status(200)
      .send( savedUser)
    }
    catch(error){
      next(error)
    }
  });
})

loginRouter.post('/wordderLogin', async (request, response, next) => {
  try{
    const body = request.body
    const user = await User.findOne({ email: body.email })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    } 

    const userForToken = {
      email: user.email,
      id: user._id,
    }

     // token expires in 60*60 seconds, that is, in one hour
     const token = jwt.sign(
      userForToken, 
      process.env.SECRET,
      { expiresIn: 60*60}
    )

    response
      .status(200)
      .send({ token, user: user })
  } catch (error){
    next(error)
  }
})


module.exports = loginRouter