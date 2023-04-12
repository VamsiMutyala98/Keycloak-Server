const express = require('express');
const multer = require('multer');
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      const err = new Error('Only image files are allowed');
      err.statusCode = 400;
      return cb(err, false);
    }
    cb(null, true);
  }
});
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployeeById, deleteEmployeeById } = require('../controller/employee.controller');
const { auth } = require('../utils/helper');
const router = express.Router();

router.route('/employee').post(upload.single('profileUrl'), auth, createEmployee).get(auth, getAllEmployees);
router.route('/employee/:id').get(auth, getEmployeeById).put(upload.single('profileUrl'),auth, updateEmployeeById).delete(auth, deleteEmployeeById);

module.exports = router;