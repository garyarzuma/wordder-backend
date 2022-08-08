const jwt = require('jsonwebtoken')
const facebookRouter = require('express').Router()
const User = require('../models/user')

facebookRouter.post('/', async (request, response) => {
    const body = request.body
    const userExist = await User.findOne({ email: body.email }) 
  
    if (!userExist){
      try{
        const user = new User({
          email: body.email,
          name: body.name,
          fname: body.name,
          lname: null,
          passwordHash: "none",
          picURL: body.picture.data.url
        })
        const savedUser = await user.save()
        const userForToken = {
          email: savedUser.email,
          id: savedUser._id,
        }
      
         // token expires in 60*60 seconds, that is, in one hour
        const token = jwt.sign(
          userForToken, 
          process.env.SECRET,
          { expiresIn: 60*60 }
        )
        
        response
          .status(200)
          .send({ token, user: savedUser })
  
      }catch (error) {
        console.log(error)
        response.status(401).send(error)
      }
  }
  else{
      const Existinguser = {
        email: body.email,
        name: body.name,
        fname: body.name,
        lname: null,
        picURL: body.picture.data.url
      }
      const updatedUserInfo = 
        await User.findByIdAndUpdate(userExist._id, Existinguser, { new: true })
      
        const userForToken = {
        email: updatedUserInfo.email,
        id: updatedUserInfo._id,
      }
      
      // token expires in 60*60 seconds, that is, in one hour
      const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
      )
        
      response
        .status(200)
        .send({ token, user: updatedUserInfo })
  }
  
})

module.exports = facebookRouter;