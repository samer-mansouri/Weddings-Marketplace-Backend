const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.set('toJSON', { virtuals: true })

MessageSchema.virtual("user", {
  ref: "User",
  foreignField: "_id",
  localField: "users[1]"
});

module.exports = mongoose.model("Message", MessageSchema);