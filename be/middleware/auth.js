const jwt = require('jsonwebtoken');
const { jwt_secret } = require("../config")
const Admin = require("./../models/admin")


exports.isAuth = async (req, res, next) => {
    try {
        const authHeader = req.query.Authorization || req.get('Authorization')
        if (!authHeader)
            throw new Error('Not authenticated.')
        const token = authHeader.split(' ')[1]
        const decodedToken = jwt.verify(token, jwt_secret)
        if (!decodedToken)
            throw new Error('Not authenticated.')
        req.userId = decodedToken.userId
        console.log("userId",req.userId)
        const user = await Admin.findOne({_id:req.userId})
        if (!user)
            throw new Error("This user does not exist")
        if (user.company)
            req.companyId = user.company.toString()
        req.email = user.email
        req.superadmin=user.superadmin
        req.companyadmin = user.companyadmin
        req.userId = decodedToken.userId
        next()
    } catch (error) {
        next(error)
    }
}