const express = require('express')
const router = express.Router()
const {getCountries } = require('../controller/global')


router.get('/countries', getCountries)

module.exports = router