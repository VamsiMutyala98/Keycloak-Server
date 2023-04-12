const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");

const clientDetailsSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'client_name is required*'],
  },
  email: {
    type: String,
    required: [true, 'client_email is required*'],
    validate: {
      validator: function (v) {
        return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  contactNumber: {
    type: String,
    required: [true, 'contact number is required*'],
    validate: {
      validator: function (v) {
        return /^[6789]{1}\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  }
})

const teamMembersSchema = new Mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  members: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
});

const expressProjectSchema = new Mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'project_name is required*'],
  },
  companyName: {
    type: String,
    required: [true, 'company_name is required*'],
  },
  clientDetails: [clientDetailsSchema],
  companyLogo: {
    type: String,
    default: '',
  },
  manager: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'manager_id is required*']
  },
  associateManager: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  projectLead: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  teamMembers: [teamMembersSchema],
});

expressProjectSchema.plugin(timeStamps);

const Project = Mongoose.model("project", expressProjectSchema);

module.exports = Project;