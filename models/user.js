const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  name: String,
  fname: String,
  lname: String,
  passwordHash: {
     type: String,
     required: true
  },
  picURL: String,
  gamesWon: {
    type: Number,
    default: 0,
  },
  guessesArray: {
    type: [Number],
    default: [],
  }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User