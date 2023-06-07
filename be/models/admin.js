const { Schema, model } = require('mongoose')

const adminSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    isapproved: {
        type: Boolean,
        required: true
    },
    superadmin: {
        type: Boolean,
        required: true
    },
    companyadmin: {
        type: Boolean,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { 
    timestamps: true 
});

adminSchema.pre('find', function() {
    this.where({ isdeleted: false });
  });
  
adminSchema.pre('findOne', function() {
    this.where({ isdeleted: false });
  });

adminSchema.statics.addUser = async (user) => {
    const newUser = await adminModel.create(user)
    return newUser
}

const adminModel = model('Admin', adminSchema)

module.exports = adminModel