const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FooterSchema = new Schema(
  {
    col_number: {
      type: Number,
      required: true,
    },
    col_values: {
      type: [Array],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "footer",
  }
);

module.exports = mongoose.model("Footer", FooterSchema);
