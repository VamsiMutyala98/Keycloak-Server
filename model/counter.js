const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const expressCounterSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: [true, 'Duplicate name is not allowed']
  },
  count: {
    type: Number,
    required: true
  }
});

expressCounterSchema.plugin(timeStamps);

const Counter = Mongoose.model("counter", expressCounterSchema);

module.exports = Counter;