const Admin = require('./../models/admin')
const Company = require('./../models/company')
const Kyc = require('./../models/kyc')
const Configuration = require('./../models/configuration')
const {generateAccessKey } =require('../utils/util');
  
  exports.getAllCompanyKycs = async (req, res, next) => {
    try {
      const { _id,configId } = req.query;
      
      if(configId.length===0)
      {
        const kycRecords = await Kyc.find({ companyId: _id })
        .select('kycCompleted kycStatus createdAt userId')
        .populate('userId', 'email')
        .sort({ createdAt: -1 });
  
        return res.json({success: true,allKyc:kycRecords});
      }
      else{
        const kycRecords = await Kyc.find({ companyId: _id,configId:configId })
        .select('kycCompleted kycStatus createdAt userId')
        .populate('userId', 'email')
        .sort({ createdAt: -1 });
  
        return res.json({success: true,allKyc:kycRecords});
      }

    } catch (err) {
      next(err);
    }
  };

  exports.getKycDetails = async (req, res, next) => {
    try {
      const { kycId } = req.query;
  
      const kycRecord = await Kyc.findById(kycId)
        .select('_id kycCompleted createdAt country documentType kycMessage kycStatus')
        .populate('userId', 'email')
        .populate('selfieId documentId', 'fileData');
  
      res.json(kycRecord);
    } catch (err) {
      next(err);
    }
  };

  exports.getKycStats = async (req, res, next) => {
    try {
      const { _id,configId } = req.query;
      console.log(configId)
      let company=await Company.findOne({_id:_id})
      if (!company){
        const admin=await Admin.findOne({_id:_id})
        if(!admin){
          return res.json({success:false})
        }
        company=await Company.findOne({_id:admin.company})
      }
      const total=company.totalKyc
      const left=company.kycLeft
      let complete
      let success
      let failed
      let attempted
      
      if(configId.length===0)
      {
        complete = await Kyc.countDocuments({ companyId:company._id,kycCompleted: true });
        success = await Kyc.countDocuments({ companyId:company._id,kycStatus: true });
        failed = await Kyc.countDocuments({companyId:company._id, kycStatus: false });
        attempted= await Kyc.countDocuments({companyId:company._id})
      }
      else{
        complete = await Kyc.countDocuments({ companyId:company._id,kycCompleted: true,configId:configId });
        success = await Kyc.countDocuments({ companyId:company._id,kycStatus: true,configId:configId });
        failed = await Kyc.countDocuments({companyId:company._id, kycStatus: false,configId:configId });
        attempted= await Kyc.countDocuments({companyId:company._id,configId:configId})
      }

      
      return res.json({success:true,kycCounts:{total,left,attempted,complete,success,failed}})
    } catch (err) {
      console.log(err)
      next(err);
    }
  };

  exports.getAllConfig = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const company = await Company.findOne({ _id });
  
      if (company.configurations && company.configurations.length > 0) {
        return res.json({ success: true, configurations: company.configurations });
      } else {
        // Create a new configuration
        const newConfig = await Configuration.create({companyId:company._id});
  
        // Add the new configuration's ID to the company's configurations array
        company.configurations.push(newConfig._id);
        await company.save();
  
        return res.json({ success: true, configurations: company.configurations });
      }
    } catch (err) {
      next(err);
    }
  };

  exports.createNewConfig = async (req, res, next) => {
    try {
      const { _id } = req.body;
      const company = await Company.findOne({ _id });
      if(company.configurationLimit>company.configurations.length){
        const newConfig = await Configuration.create({companyId:company._id});
        company.configurations.push(newConfig._id);
        await company.save();
        return res.json({ success: true, configurations: company.configurations });
      }
        return res.json({ success: false, message:'Your Configuration limit is reached' });
    } catch (err) {
      next(err);
    }
  };

  exports.getAccessKey = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const config=await Configuration.findOne({_id:_id})
      if(config.accessKey){
        return res.json({success:true,accessKey:config.accessKey})
      }
    const key=generateAccessKey()
    config.accessKey=key
    await config.save()
        return res.json({success:true,accessKey:key})
      
    } catch (err) {
      next(err);
    }
  };

  exports.generateKey = async (req, res, next) => {
    try {
      const { _id } = req.body;
      console.log(req.body)
      const config=await Configuration.findOne({_id:_id})
      
      const key=generateAccessKey()
      config.accessKey=key
      await config.save()
      return res.json({success:true,accessKey:key})
      
    } catch (err) {
      next(err);
    }
  };

  exports.getWebsiteUrl = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const config=await Configuration.findOne({_id:_id})
      
      if(config.websiteUrl){
        return res.json({success:true,websiteUrl:config.websiteUrl})
      }
      return res.json({success:false})
      
    } catch (err) {
      next(err);
    }
  };

  exports.setWebsiteUrl = async (req, res, next) => {
    try {
      const { _id,websiteUrl } = req.body;
      const config=await Configuration.findOne({_id:_id})
      config.websiteUrl=websiteUrl
      await config.save()
      return res.json({success:true})
      
    } catch (err) {
      next(err);
    }
  };

  

  exports.getRedirectUrl = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const config=await Configuration.findOne({_id:_id})
      if(config.redirectUrl){
        return res.json({success:true,redirectUrl:config.redirectUrl})
      }
      return res.json({success:false})
      
    } catch (err) {
      next(err);
    }
  };

  exports.setRedirectUrl = async (req, res, next) => {
    try {
      const { _id,redirectUrl } = req.body;
      const config=await Configuration.findOne({_id:_id})
      config.redirectUrl=redirectUrl
      await config.save()
      return res.json({success:true})
      
    } catch (err) {
      next(err);
    }
  };

  exports.getWebhookUrl = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const config=await Configuration.findOne({_id:_id})
      if(config.webhook){
        return res.json({success:true,webhookUrl:config.webhook})
      }
      return res.json({success:false})
      
    } catch (err) {
      next(err);
    }
  };

  exports.setWebhookUrl = async (req, res, next) => {
    try {
      const { _id,webhookUrl } = req.body;
      const config=await Configuration.findOne({_id:_id})
      config.webhook=webhookUrl
      await config.save()
      return res.json({success:true})
      
    } catch (err) {
      next(err);
    }
  };