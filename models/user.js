const mongoose = require('mongoose');


// **  INSECURE BRANCH ** 
// simple schema - removed: passportLocalMongoose
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});



module.exports = mongoose.model('User', UserSchema);
