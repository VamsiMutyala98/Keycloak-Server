const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const expressConstantSchema = new Mongoose.Schema({
  type: {
    type: String,
    required: [true, 'name is required'],
    unique: [true, 'Duplicate name is not allowed']
  },
  values: {
    type: [String],
    required: true,
  },
});

expressConstantSchema.plugin(timeStamps);

const Constant = Mongoose.model("constant", expressConstantSchema);

module.exports = Constant;