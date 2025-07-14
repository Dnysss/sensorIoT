const mongoose = require("mongoose");

const nivelSchema = new mongoose.Schema(
  {
    nivel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nivel", nivelSchema);
