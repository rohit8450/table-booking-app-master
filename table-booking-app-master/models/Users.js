const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Table = new Schema({
  number: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  booked_tables: {
    type: [Table],
    default: null,
  },
});
module.exports = User = mongoose.model("users", UserSchema);
