const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const smsSchema = new Mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required'],
    unique: [true, 'Duplicate phone number is not allowed']
  },
  otp: {
    type: String,
    required: [true, 'One Password is required'],
  },
  isExpired: {
    type: Boolean,
    default: false,
  }
});

smsSchema.plugin(timeStamps);

const SMS = Mongoose.model("sms", smsSchema);

module.exports = SMS;