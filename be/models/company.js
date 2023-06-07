const { Schema, model } = require('mongoose')

const AdminSchema = Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    accessRight: {
        type: Number,
        default: 0 // TODO: provide the a list of valid values for this status and their access rights
    },
    user: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true,
        ref: 'Admin'
    }
}, { _id: false })

const companySchema = new Schema({
    companyName: {
        type: String,
        unique: true,
        required: true
    },
    configurations: [{
        type: Schema.Types.ObjectId,
        ref: 'Configuration'
    }],
    configurationLimit:{
        type: Number
    },
    totalKyc:{
        type: Number
    },
    kycLeft:{
        type: Number
    },
    users: [AdminSchema]
}, { timestamps: true })

companySchema.statics.addCompany = async (company) => {
    const newCompany = await companyModel.create(company)
    return newCompany
}

const companyModel = model('Company', companySchema)

module.exports = companyModel