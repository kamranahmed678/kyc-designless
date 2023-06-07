const { Schema, model } = require('mongoose');

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileData: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    kycId: {
        type: Schema.Types.ObjectId,
        ref: 'Kyc',
        required: true
    }
}, {
    timestamps: true
});

const fileModel = model('File', fileSchema);

module.exports = fileModel;