const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const ReservationSchema = new mongoose.Schema({
  userId : {
    type: String,
    required: true
  },
  receiver :{
    type: String,
    required: true
  },
    annonceId : {
    type: String,
    required: true
},
});

ReservationSchema.set('toJSON', { virtuals: true })

ReservationSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "userId"
});

ReservationSchema.virtual("Annonce", {
  ref: "Annonce",
  foreignField: "_id",
  localField: "annonceId"
});



ReservationSchema.plugin(timestamps);
mongoose.model("Reservation", ReservationSchema)