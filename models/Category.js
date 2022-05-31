const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

CategorySchema.set('toJSON', { virtuals: true })

CategorySchema.virtual("annonces", {
    ref: "Annonce",
    foreignField: "categoryId",
    localField: "_id"
  });
  
  


CategorySchema.plugin(timestamps);
mongoose.model("Category", CategorySchema)