const { Schema, model } = require('mongoose');

const kycSchema = new Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Company',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  configId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Config',
  },
  selfieId: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
  documentId: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
  documentType: {
    type: String,
  },
  country:{
    type:String,
  },
  
  kycCompleted:{
    type:Boolean
  },
  kycStatus:{
    type:Boolean
  },
  kycMessage:{
    type:String
  },
}, { timestamps: true });

const kycmodel = model('Kyc', kycSchema);

module.exports = kycmodel;