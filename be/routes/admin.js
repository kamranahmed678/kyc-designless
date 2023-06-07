const express = require('express')
const router = express.Router()

const {postUserRegister,postUserLogin,validate } = require('../controller/admin')
const {getAllUsers,editApproval,deleteUser,unDeleteUser,getKycCount } = require('../controller/super')
const { isAuth } = require('../middleware/auth')



router.post('/register', validate("postUserRegister"),postUserRegister)
router.post('/login', validate("postUserLogin"),postUserLogin)
router.get('/getall',isAuth, getAllUsers)
router.post('/editapproval',isAuth, editApproval)
router.post('/delete',isAuth, deleteUser)
router.post('/undelete',isAuth, unDeleteUser)
router.get('/getkyccount',isAuth, getKycCount)

module.exports = router