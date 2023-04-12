const Mongoose = require("mongoose");
const timeStamps = require("mongoose-timestamp");
const Constant = require("./constant");

const expressEmployeeSchema = new Mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstname is required*'],
  },
  lastName: {
    type: String,
    required: [true, 'lastname is required*'],
  },
  email: {
    type: String,
    required: [true, 'email is required*'],
    unique: [true, 'email already exists!'],
    validate: {
      validator: function (v) {
        return /\b[A-Z0-9._%+-]+@fissionlabs\.[A-Z]{2,}\b/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  profileUrl: {
    type: String,
    default: '',
  },
  employeeId: {
    type: String,
    required: [true, 'employee_id is required*'],
    unique: [true, 'employee_id already exists!']
  },
  contactNumber: {
    type: String,
    required: [true, 'contact number is required*'],
    unique: [true, 'mobile number already exists!'],
    validate: {
      validator: function (v) {
        return /^[6789]{1}\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  joiningDate: {
    type: Date,
    required: [true, 'joining date is required*'],
    validate: {
      validator: function (v) {
        return  new Date(v).toString() !== 'Invalid Date';;
      },
      message: (props) => `${props.value} invalid date format. Eg: 'YYYY-MM-DD'!`,
    },
  },
  skills: {
    type: [String],
    required: [true, 'skills is required*'],
    validate: {
      validator: function (v) {
        return validateSkillandRole('skills', v);
      },
      message: 'Invalid Skill, Ask admin to add your skill',
    }
  },
  status: {
    type: String,
    required: [true, 'status is required*'],
    enum: ['', 'Bench', 'Shadow', 'Project']
  },
  role: {
    type: String,
    validate: {
      validator: function (v) {
        return validateSkillandRole('roles', v);
      },
      message: 'Invalid Role, Ask admin to add your role',
    }
  }
});

expressEmployeeSchema.plugin(timeStamps);

const Employee = Mongoose.model("employee", expressEmployeeSchema);

module.exports = Employee;


const validateSkillandRole = async (type, value) => {
  const validateAggregation = [
    {
      $match: {
        $and: [
          {
            type: `${type}`,
          },
          {
            values: {
              $in: type === 'skills' ? value : [`${value}`],
            },
          },
        ],
      },
    },
  ]
  const constant = await Constant.aggregate(validateAggregation);
  if (constant.length) {
    return true;
  }
  return false;
}