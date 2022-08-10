const jwt = require('jsonwebtoken')
const googleRouter = require('express').Router()
const User = require('../models/user')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

googleRouter.post("/", async (req, res, next) => {
  console.log(req.body)
  const { given_name, family_name, name, email, picture } = req.body 
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
      const userForToken = {
        email: savedUser.email,
        id: savedUser._id,
      }
    
       // token expires in 60*60 seconds, that is, in one hour
       const wordderToken = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
      )
      
      res
        .status(200)
        .send({ token: wordderToken, user: savedUser})
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
          picURL: picture
      }
      const updatedUserInfo = await User.findByIdAndUpdate(userExist._id, Existinguser, { new: true })
      const userForToken = {
        email: updatedUserInfo.email,
        id: updatedUserInfo._id,
      }
       // token expires in 60*60 seconds, that is, in one hour
       const wordderToken = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
      )
     
      res
        .status(200)
        .send({ token: wordderToken, user: updatedUserInfo })
  }
})

module.exports = googleRouter;