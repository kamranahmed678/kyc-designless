const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    token:{
        type: String
    },
    tokenExpiry:{
        type: Date
    },
    activeSession:{
        type: Schema.Types.ObjectId,
        ref: 'Kyc'
    }
}, { 
    timestamps: true 
});

userSchema.statics.addUser = async (user) => {
    const newUser = await userModel.create(user)
    return newUser
}

const userModel = model('User', userSchema)

module.exports = userModel