const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const Gender = Object.freeze({
  Male: 'Male',
  Female: 'Female',
});

const Role = Object.freeze({
  Admin: 'Admin',
  Annonceur: 'Annonceur',
  Client: 'Client'
});


const UserSchema = new mongoose.Schema({
  firstName : {
    type: String,
    minLength: 5,
    maxLength: 55,
    required: 'This field is required'
  },

  lastName : {
    type: String,
    minLength: 5,
    maxLength: 55,
    required : 'This field is required'
  },
  dateOfBirth : {
    type: Date,
    required : 'This field is required'
  },
  picture: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: 'This field is required'
  },
  phoneNumber: {
    type: String,
    minLength: 8,
    maxLength: 8,
    required: 'This field is required'
  },
  email : {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    required : 'This field is required'
  },
  gender : {
    type: String,
    enum: Object.values(Gender),
  },
  password : {
    type: String,
    required : 'This field is required',
    minLength: 8,
    maxLength: 255
  },
  refreshToken: String,
  role: {
    type: String,
    enum: Object.values(Role),
  },
});

/*UserSchema.set('toJSON', { virtuals: true })

UserSchema.virtual("garage", {
  ref: "Vehicule",
  foreignField: "userId",
  localField: "_id"
});

UserSchema.pre('remove', function(next) {
  Vehicule.remove({userId: this._id}).exec();
  Reservation.remove({userId: this._id}).exec();
  Trajet.remove({userId: this._id}).exec();
  Covoiturage.remove({userId: this._id}).exec();
  next();
});*/

UserSchema.plugin(timestamps);
mongoose.model("User", UserSchema)