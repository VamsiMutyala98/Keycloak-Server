const Employee = require('../model/employee');
const Counter = require('../model/counter');
const CatchAsync = require('../utils/catchAsync');
const { S3Bucket } = require('../utils/s3Bucket');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');


exports.createEmployee = CatchAsync(async (req, res) => {
    let profileUrl = '';
    let data = {...req.body, employeeId: 'FL-1', joiningDate: new Date(req.body?.joiningDate)}
    const counter = await Counter.find({ name: 'employeeCount' });
    if (counter.length) {
      const [employeeCount] = counter;
      data = {...data, employeeId: `${process.env.ORGANIZATION_ABBERIVATION}-${employeeCount.count + 1}`}
    }
    if (req?.file?.originalname && req?.file?.buffer) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profileImages/${data.employeeId}.${req?.file?.originalname.split('.').slice(-1).join('')}` || '',
        Body: req?.file?.buffer || ''
      }
      profileUrl = await S3Bucket(params);
      profileUrl = profileUrl.replace(process.env.AWS_S3BUCKET_DOMAIN, '');
    }
    data = {...req.body, profileUrl, skills: req?.body?.skills?.split(',') || []};
    const employee = await Employee.create({...data});
    if (employee) {
      if (counter?.length) {
        const [employeeCount] = counter;
        const updateCountValue = await Counter.findOneAndUpdate({name: 'employeeCount'}, {count: employeeCount.count + 1});
        if (updateCountValue) {
          data = { ...data, employeeId: `${process.env.ORGANIZATION_ABBERIVATION}-${employeeCount.count + 1}`}
        }
      } 
      if (!counter.length) {
        const initialCount = await Counter.create({name: 'employeeCount', count: 1});
        if (initialCount) {
          data = { ...data, employeeId: `${process.env.ORGANIZATION_ABBERIVATION}-1` }
        }
      }
      res.status(200).json({
        status: 200,
        message: 'Employee Data Created Successfully'
      });
    }
  }
)

exports.getAllEmployees = CatchAsync(async (req, res) => {
  console.log('fourth');
  const employeePipeline = [
    {
      $lookup: {
        from: "projects",
        let: {
          projectId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $in: [
                      true,
                      {
                        $map: {
                          input: "$teamMembers",
                          as: "teamMembers",
                          in: {
                            $cond: {
                              if: {
                                $in: [
                                  "$$projectId",
                                  "$$teamMembers.members",
                                ],
                              },
                              then: true,
                              else: false,
                            },
                          },
                        },
                      },
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$manager",
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$associateManager",
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$projectLead",
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "projectDetails",
      },
    },
    {
      $addFields: {
        profileUrl: {
          $cond: {
            if: {
              $eq: ["$profileUrl", ""],
            },
            then: "",
            else: {
              $concat: [process.env.AWS_S3BUCKET_DOMAIN, "$profileUrl"],
            },
          },
        },
      },
    },
  ];
  const employees = await Employee.aggregate(employeePipeline);
  if (employees) {
    res.status(200).json({
      status: 200,
      message: 'Get All Employee Details Successfully',
      data: [...employees]
    });
  }
});

exports.getEmployeeById = CatchAsync(async (req, res) => {
  const ids = mongoose.Types.ObjectId(req?.params?.id);
  const pipeline = [
    {
      $match:
        {
          _id: {
            $in: ids,
          },
        },
    },
    {
      $lookup: {
        from: "projects",
        let: {
          projectId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $in: [
                      true,
                      {
                        $map: {
                          input: "$teamMembers",
                          as: "teamMembers",
                          in: {
                            $cond: {
                              if: {
                                $in: [
                                  "$$projectId",
                                  "$$teamMembers.members",
                                ],
                              },
                              then: true,
                              else: false,
                            },
                          },
                        },
                      },
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$manager",
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$associateManager",
                    ],
                  },
                  {
                    $eq: [
                      "$$projectId",
                      "$projectLead",
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "projectDetails",
      },
    },
    {
      $addFields: {
        profileUrl: {
          $cond: {
            if: {
              $eq: ["$profileUrl", ""],
            },
            then: "",
            else: {
              $concat: ["Something", "$profileUrl"],
            },
          },
        },
      },
    },
  ];
  const employee = await Employee.aggregate(pipeline);
  if (employee) {
    res.status(200).json({
      status: 200,
      message: 'Get Employee By Id Successfully',
      data: employee,
    })
  }
});

exports.updateEmployeeById = CatchAsync(async (req, res) => {
  let data = {...req?.body};
  if (req.body.skills) {
    data = {...data, skills: data.skills.spilt(", ")}
  }
  if (req?.file?.originalname && req?.file?.buffer && req?.body?.employeeId) {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `profileImages/${req?.body?.employeeId}.${req?.file?.originalname.split('.').slice(-1).join('')}` || '',
      Body: req?.file?.buffer || ''
    }
    profileUrl = await S3Bucket(params);
    // profileUrl = profileUrl.replace(process.env.AWS_S3BUCKET_DOMAIN, '');
    data = {...data, profileUrl};
  }
  if (req?.file?.originalname && !req?.body?.employeeId) {
    res.status(400).json({
      status: 400,
      message: 'Employee Id is required*'
    });
  }
  const employee = await Employee.findByIdAndUpdate(req?.params?.id, {...data}, {
      new: true,
      runValidators: true,
    });
  if (employee) {
    res.status(200).json({
      status: 200,
      message: 'Employee Details Updated Successfully',
      data: employee,
    })
  }
});

exports.deleteEmployeeById = CatchAsync(async (req, res) => {
  const employee =  await Employee.findByIdAndDelete(req?.params?.id< { new: true, runValidators: true });
  if(employee) {
    res.status(200).json({
      status: 200,
      message: 'Employee deleted successfully',
    })
  }
})
