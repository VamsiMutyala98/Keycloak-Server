const catchAsync = require("../utils/catchAsync");
const Constant = require("../model/constant");

exports.create= catchAsync( async (req, res) => {
  const data = {...req.body};
  const constant = await Constant.create(data);
  if (constant) {
    res.status(200).json({
      status: 200,
      message: 'Constant data created successfully'
    });
  };
});

exports.getAllConstantData = catchAsync( async(req, res) => {
  const constant = await Constant.find({});
  if (constant) {
    res.status(200).json({
      status: 200,
      message: 'Getting constant data successfully',
      data: constant,
    })
  }
});

exports.getConstantDataByType = catchAsync( async(req, res) => {
  const constant = await Constant.findOne({type: req?.query?.type});
  if (constant) {
    res.status(200).json({
      status: 200,
      message: 'Getting constant by type data successfully',
      data: constant,
    })
  }
});

exports.update = catchAsync( async (req, res) => {
  const constant = await Constant.findOneAndUpdate({type: req?.query?.type}, { $addToSet: { values: [...req?.body?.values] } }, { new: true, runValidators: true});
  if (constant) {
    res.status(200).json({
      status: 200,
      message: 'Updated constant data successfully'
    })
  }
})