
const bcrypt = require('bcrypt')
const Admin = require('./../models/admin')
const Company = require('./../models/company')
const { bcrypt_salt_rounds } = require('./../config')
const { body } = require('express-validator')
const { generateToken} =require('../utils/util');


exports.postUserRegister = async (req, res, next) => {
    let newCompany; // Declare newCompany outside the try block
    try {
        const { companyName, password, firstName, lastName, email } = req.body
        const isUserTaken = await Admin.findOne({ email: email })
        if (isUserTaken)
            throw new Error('An account with this email already exists')
        const hashedPass = await bcrypt.hash(password, bcrypt_salt_rounds)
        // Add a new company
        newCompany = await Company.create({ companyName, users: [],totalKyc:50,kycLeft:50,configurationLimit:3 })
        // Add a new user and refer to the connected company
        const newUser = await Admin.addUser({ firstname:firstName, lastname:lastName, email, password: hashedPass, company: newCompany._id, isapproved: false, superadmin: false, companyadmin: true, isdeleted: false })
        // Add the new user to the referred company
        newCompany.users = [{ isAdmin: true, user: newUser._id }]
        await newCompany.save()
        res.json({
            success: true,
            companyId: newCompany._id
        })
    } catch (err) {
        // Delete the company if adding the user fails
        if (newCompany) {
            await Company.deleteOne({ _id: newCompany._id })
        }
        next(err)
    }
}

exports.postUserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await Admin.findOne({ email: email })
        
        if (!user || user.isdeleted){
            res.json({
                success:false,
                message:'A user with this email could not be found'
            })
            throw new Error('A user with this email could not be found')
        }
        const userId = user._id.toString()
        
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual){
            res.json({
                success:false,
                message:'Wrong password'
            })
            throw new Error('Wrong password')}
        if(!user.isapproved && !user.superadmin){
            res.json({
                success:false,
                message:'User not approved by Admin'
            })
            throw new Error('User not approved by Admin')}

        const token = generateToken(userId)

        res.json({
            success: true,
            token: token,
            userId: userId,
            superadmin: user.superadmin,
            companyadmin: user.companyadmin,
            companyid: user.company
        })
    }
    catch (err) {
        next(err)
    }
}

exports.validate = (method) => {
    switch (method) {
        case 'postUserRegister':
            return [
                body('companyName', 'Enter a valid company name').exists().bail().trim().notEmpty().isString(),
                body('firstname', 'Enter a valid firstname').exists().bail().trim().notEmpty().isString(),
                body('lastname', 'Enter a valid lastname').exists().bail().trim().notEmpty().isString(),
                body('email', 'Enter a valid email').isEmail().bail().normalizeEmail(),
                body('password', 'Enter a valid password').exists().bail().trim().notEmpty().isString(),
                body('confirmPassword', 'Enter a valid confirm password').exists().bail().trim().notEmpty().isString().bail().custom((value, { req }) => {
                    if (value === req.body.password)
                        return true
                    throw new Error('Passwords have to match')
                })
            ]
        default:
            return []
    }
}