const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

loginRouter.post('/wordderLogin', async (request, response) => {
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
    { expiresIn: 60*60 }
  )
 
  response
    .status(200)
    .send({ token, user: user })
})

loginRouter.post("/v1/auth/google", async (req, res, next) => {
  console.log(req.body)
  const {token}   = req.body
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const { given_name, family_name, name, email, picture } = ticket.getPayload(); 
  const userExist = await User.findOne({ email: email })  

  if (!userExist){
      try{
          const user = new User({
              email: email,
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
          email: email,
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

module.exports = loginRouter