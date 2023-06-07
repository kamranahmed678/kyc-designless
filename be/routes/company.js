const express = require('express')
const router = express.Router()

// const {postUserRegister,postUserLogin,validate } = require('../controller/admin')
// const {getAllUsers,editApproval,deleteUser,unDeleteUser,getKycCount } = require('../controller/super')
const {getAllCompanyKycs,getKycDetails,getKycStats,getAccessKey, getWebsiteUrl,generateKey,setWebsiteUrl,setRedirectUrl,getRedirectUrl,setWebhookUrl,getWebhookUrl,getAllConfig,createNewConfig} = require('../controller/company')
const { isAuth } = require('../middleware/auth')


router.get('/company-kycs',isAuth, getAllCompanyKycs)
router.get('/getdetails',isAuth, getKycDetails)
router.get('/getstats',isAuth, getKycStats)
router.get('/getkey',isAuth, getAccessKey)
router.get('/getallconfig',isAuth, getAllConfig)
router.post('/createnewconfig',isAuth, createNewConfig)
router.post('/generatekey',isAuth, generateKey)
router.get('/getwebsiteurl',isAuth, getWebsiteUrl)
router.post('/setwebsiteurl',isAuth, setWebsiteUrl)
router.get('/getredirecturl',isAuth, getRedirectUrl)
router.post('/setredirecturl',isAuth, setRedirectUrl)
router.get('/getwebhookurl',isAuth, getWebhookUrl)
router.post('/setwebhookurl',isAuth, setWebhookUrl)

module.exports = router