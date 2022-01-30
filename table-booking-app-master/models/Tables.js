const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Table = new Schema({
  number: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const TablesSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
  },
  available_tables: {
    type: [Table],
    default: null,
  },
  booked_tables: {
    type: [Table],
    default: null,
  },
});

module.exports = Tables = mongoose.model("tables", TablesSchema);
