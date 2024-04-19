const { Schema, model } = require("mongoose");

const PhotoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  notes: {
    type: String,
    maxlength: 255,
  },
});

const Photo = model("Photo", PhotoSchema);

module.exports = Photo;
