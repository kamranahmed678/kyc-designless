const { Schema, model } = require('mongoose');

const configurationSchema = Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company',
    },
    accessKey: {
        type: String,
        unique: true,
    },
    websiteUrl: {
        type: String,
    },
    redirectUrl: {
        type: String,
    },
    webhook: {
        type: String,
    }
});

const configurationModel = model('Configuration', configurationSchema);

module.exports = configurationModel;