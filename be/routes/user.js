const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload');

const {postUserLogin,selectDocumentType,uploadDocument,uploadSelfie,doKyc, validate } = require('../controller/user')


router.post('/login', postUserLogin)
router.post('/selectdoc', selectDocumentType)
router.post('/uploaddoc',upload.single('file'),uploadDocument)
router.post('/uploadselfie',upload.single('file'),uploadSelfie)
router.get('/dokyc', doKyc)

module.exports = router