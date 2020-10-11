const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requireed: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    requiired: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
