const express = require('express');
const { registerSchool, GetAllSchools, loginSchool, updateSchool, getSchoolOwnData } = require('../controllers/school.controller')
const authMiddleware = require('../auth/auth')

//const router = express.Router();
const router = require('express').Router();


router.post('/register', registerSchool);
router.get('/all', GetAllSchools);
router.post('/login', loginSchool);
router.patch('/update',  authMiddleware([`SCHOOL`]),  updateSchool);      // Authenticated user for update from middleware file
router.get('/fetchsingle',  authMiddleware([`SCHOOL`]), getSchoolOwnData);


module.exports = router;