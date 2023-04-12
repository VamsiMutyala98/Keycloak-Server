const express = require('express');
const { create, getAllProjects, getProjectById, updateProjectById } = require('../controller/project.controller');
const { auth } = require('../utils/helper');
const router = express.Router();

router.route('/project').post(auth, create).get(auth, getAllProjects);
router.route('/project/:id').get(auth, getProjectById).put(auth, updateProjectById);

module.exports = router;