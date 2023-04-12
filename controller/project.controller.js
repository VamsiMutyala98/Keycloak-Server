const catchAsync = require("../utils/catchAsync");
const Project = require('../model/project');

exports.create = catchAsync(async (req, res) => {
  const data = {...req.body};
  const project = await Project.create(data);
  if (project) {
    res.status(200).json({
      status: 200,
      message: 'Project created successfully'
    })
  }
});

exports.getAllProjects = catchAsync(async (req, res) => {
  const aggregationPipeline = [
    {
      $lookup:
        {
          from: "employees",
          localField: "manager",
          foreignField: "_id",
          as: "manager",
        },
    },
    {
      $unwind: {
        path: "$manager",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "associateManager",
        foreignField: "_id",
        as: "associateManager",
      },
    },
    {
      $unwind: {
        path: "$associateManager",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "projectLead",
        foreignField: "_id",
        as: "projectLead",
      },
    },
    {
      $unwind: {
        path: "$projectLead",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind:
        {
          path: "$teamMembers",
          preserveNullAndEmptyArrays: true,
        },
    },
    {
      $lookup: {
        from: "employees",
        localField: "teamMembers.members",
        foreignField: "_id",
        as: "teamMembers.members",
      },
    },
    {
      $group: {
        _id: "$_id",
        teamMembers: {
          $push: "$teamMembers",
        },
        doc: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $project: {
        doc: {
          _id: 1,
          projectName: 1,
          companyName: 1,
          companyLogo: 1,
          clientDetails: 1,
          manager: 1,
          associateManager: 1,
          projectLead: 1,
          teamMembers: "$teamMembers",
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$doc",
      },
    },
  ]
  const project = await Project.aggregate(aggregationPipeline);
  if (project?.length) {
    res.status(200).json({
      status: 200,
      message: 'Getting all projects successfully',
      data: project
    })
  }
});

exports.getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findById(req?.params?.id);
  if (project && Object.keys(project)?.length) {
    res.status(200).json({
      status: 200,
      message: 'Getting all projects successfully',
      data: project
    })
  }
});

exports.updateProjectById = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req?.params?.id, {...req.body}, { new: true, runValidators: true});
  if (project && Object.keys(project)?.length) {
    res.status(200).json({
      status: 200,
      message: 'Project Updated successfully',
      data: project
    })
  }
});


exports.duplicate = catchAsync(async (req, res) => {
  
})