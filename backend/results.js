const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      trim: true,
    },
    Link: {
      type: String,
      trim: true,
    },
    Name: {
      type: String,
      trim: true,
    },
    Author: {
      type: String,
      trim: true,
    },
    Year: Number,
    Pages: Number,
    Size: {
      type: String,
      trim: true,
    },
    Type: {
      type: String,
      trim: true,
    },
    Journal: {
      type: String,
      trim: true,
    },
    Category: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports.results = mongoose.model("results", schema);
