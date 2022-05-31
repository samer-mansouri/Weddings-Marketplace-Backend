const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const AnnonceSchema = new mongoose.Schema({
  userId : {
    type: String,
    required: true
  },
  categoryId : {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images : {
    type: Array,
    required: true
  }
});

AnnonceSchema.set('toJSON', { virtuals: true })

AnnonceSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "userId"
});

AnnonceSchema.virtual("category", {
  ref: "Category",
  foreignField: "_id",
  localField: "categoryId"
});



AnnonceSchema.plugin(timestamps);
mongoose.model("Annonce", AnnonceSchema)