const mongoose = require('mongoose')
const express = require('express')
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');


const userRoute = require('./routes/user')
const globalRoute= require('./routes/global')
const AdminRoute=require('./routes/admin')
const CompanyRoute=require('./routes/company')

const { isAuth } = require("./middleware/auth")

const config = require('./config');

const app = express()

// Preprocessing middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => res.json({ success: true }))
app.use('/user', userRoute)
app.use('/global',globalRoute)
app.use('/admin',AdminRoute)
app.use('/company',CompanyRoute)

app.use((error, req, res, next) => {
    console.log(error)
    res.json({
        success: false,
        error: error.message,
    })
})

mongoose.connect(config.database)
  .then(() => {
    console.log('Connected to the database');
    const server = app.listen(config.port, () => {
      console.log('Server started on port', config.port);
    });
  })
  .catch((err) => {
    console.log(config.database)
    console.log('Failed to connect to the database');
    console.error(err);
  });