const User = require('../models/user')
const Company = require('../models/company')
const File = require('../models/file')
const Kyc= require('../models/kyc')
const Configuration = require('./../models/configuration')
const mongoose = require('mongoose');
const axios = require('axios');
const { generateToken,uploadFile,antispoof,faceRecognition,storeImages } =require('../utils/util');

  
  exports.postUserLogin = async (req, res, next) => {
    try {
      const { email,accessKey,referrer } = req.body;
      console.log(email);
      console.log(referrer)
      const config=await Configuration.findOne({accessKey:accessKey})
      if(!config){
        console.log("Invalid Key")
        return res.json({success:false,message:"Invalid Access Key"})
      }
      if(config.websiteUrl!==referrer){
        console.log("Invalid Url")
        return res.json({success:false,message:"Request came from invalid website"})
      }

      const company= await Company.findOne({_id:config.companyId})
      if(company.kycLeft==0){
        return res.json({success:false,message:"Your Kyc limit has been reached"})
      }

      const user = await User.findOne({ email: email });
  
      if (user) {
        // User exists, check token expiry
        const currentDate = new Date();
        if (user.tokenExpiry && user.tokenExpiry > currentDate && user.activeSession) {
          // Token is not expired
          return res.status(200).json({token:user.token,tokenExpiry:user.tokenExpiry ,message: 'User exists and session is still valid' });
        } else {
          const newKyc=await Kyc.create({userId:user._id,kycCompleted:false,companyId:company._id,configId:config._id})
          // Token is expired, generate new token and update tokenExpiry
          const newToken = generateToken(user._id); // Pass the user's _id to generateToken
          const tokenExpiry = new Date();
          tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 10);
          user.token = newToken;
          user.tokenExpiry = tokenExpiry;
          user.activeSession=newKyc._id;
          await user.save();
          company.kycLeft-=1;
          await company.save();
          return res.status(200).json({ token: newToken, tokenExpiry:tokenExpiry , message: 'Token regenerated and session extended' });
        }
      } else {
        // User doesn't exist, create new user
        const newUser = await User.addUser({ email: email });
        const newKyc=await Kyc.create({userId:newUser._id,kycCompleted:false,companyId:company._id,configId:config._id})
        const newToken = generateToken(newUser._id); // Pass the new user's _id to generateToken
        const tokenExpiry = new Date();
        tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 10);
        newUser.token = newToken;
        newUser.tokenExpiry = tokenExpiry;
        newUser.activeSession=newKyc._id;
        await newUser.save();
        company.kycLeft-=1;
        await company.save();
        return res.status(200).json({ token: newToken, tokenExpiry:tokenExpiry , message: 'New user created and session initiated' });
      }
    } catch (err) {
      next(err);
    }
  };

  
exports.selectDocumentType = async (req, res, next) => {
  try {
    const {email,selectedType,selectedRegion}=req.body
    const user= await User.findOne({email:email})
    if(!user){
      return res.json({success:false,msg:'No user found having this email'})
    }
    const kyc= await Kyc.findOne({_id:user.activeSession})
    if(!kyc){
      return res.json({success:false,msg:'No active kyc session found for user'})
    }
    kyc.documentType=selectedType
    kyc.country=selectedRegion
    await kyc.save();
      return res.json({success:true,msg:'User info updated'})
  } catch (err) {
    next(err);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const {email,image}=req.body
    const user= await User.findOne({email:email})
    if(!user){
      return res.json({success:false,msg:'No user found having this email'})
    }
    if(!image){
      return res.json({success:false,msg:'No image found'})
    }
    const kyc= await Kyc.findOne({_id:user.activeSession})
    if(!kyc){
      return res.json({success:false,msg:'No active kyc session found for user'})
    }

    const fileId=await uploadFile({kycId:kyc._id,fileData:image,fileType:'identity'})
    kyc.documentId=fileId
    try {
      await kyc.save();
      console.log('User saved successfully.');
      return res.json({success:true,msg:'Identity document uploaded successfully'})
  } catch (error) {
      console.error('Error saving user:', error);
      return res.json({success:false,msg:'An Error occured while updating the user'})
  }
    
  } catch (err) {
    next(err);
  }
};

exports.uploadSelfie = async (req, res, next) => {
  try {
    const {email,image}=req.body
    const user= await User.findOne({email:email})
    if(!user){
      return res.json({success:false,msg:'No user found having this email'})
    }
    if(!image){
      return res.json({success:false,msg:'No image found'})
    }
    const kyc= await Kyc.findOne({_id:user.activeSession})
    if(!kyc){
      return res.json({success:false,msg:'No active kyc session found for user'})
    }

    const fileId=await uploadFile({kycId:kyc._id,fileData:image,fileType:'selfie'})
    kyc.selfieId=fileId
    try {
      await kyc.save();
      console.log('User saved successfully.');
      return res.json({success:true,msg:'Selfie uploaded successfully'})
  } catch (error) {
      console.error('Error saving user:', error);
      return res.json({success:false,msg:'An Error occured while updating the user'})
  }
    
  } catch (err) {
    next(err);
  }
};

const sendWebhook = async (kyc) => {
  try {
    const config = await Configuration.findOne({ _id: kyc.configId });
    const user = await User.findOne({ _id: kyc.userId });

    const payload = {
      email: user.email,
      kycDate: kyc.createdAt,
      kycStatus: kyc.kycCompleted ? (kyc.kycStatus ? 'Successful' : 'Failed') : 'Incomplete',
      message: kyc.kycMessage
    };

    const url = config.webhook;

    if (url)
      await axios.post(url, payload);

  } catch (e) {
    console.log(e);
  }
};

exports.doKyc = async (req, res, next) => {
  try {
    let id
    let selfie
    const {email}=req.query
    console.log(email)
    const user= await User.findOne({email:email})
    if(!user){
      return res.json({success:false,msg:'No user found having this email'})
    }
    const kyc= await Kyc.findOne({_id:user.activeSession})
    if(!kyc){
      return res.json({success:false,msg:'No active kyc session found for user'})
    }
    if(kyc.documentId){
      id=await File.findOne({_id:kyc.documentId})
    }
    if(!id || !kyc.documentId){
      return res.json({success:false,msg:'No Identity document picture found of this user'})
    }
    if(kyc.selfieId){
      selfie=await File.findOne({_id:kyc.selfieId})
    }
    if(!selfie || !kyc.selfieId){
      return res.json({success:false,msg:'No selfie found of this user'})
    }
    const resp=await storeImages({id,selfie})
    if(!resp.success){
      return res.json(resp)
    }
    const spoofingResult = await antispoof()
    if(spoofingResult==="real"){
      console.log("liveness detected")
      let faceRecognitionResult = await faceRecognition();
      faceRecognitionResult = faceRecognitionResult.split(',')[1];
      if (faceRecognitionResult === 'unknown_person') {
        console.log("face recognition failed")
        kyc.kycCompleted=true
        kyc.kycStatus=false
        kyc.kycMessage="Failed to match face in identity document and selfie"
        await kyc.save()
        await user.updateOne({ $unset: { activeSession: 1} });
        await user.save()
        await sendWebhook(kyc)
        const config=await Configuration.findOne({_id:kyc.configId})
        return res.json({success:false,msg:'Failed to match face in identity document and selfie',redirectUrl:config.redirectUrl})
      }
      else{
        console.log("face matched")
        console.log("kyc successful")
        kyc.kycCompleted=true
        kyc.kycStatus=true
        kyc.kycMessage="Kyc successful"
        await kyc.save()
        await user.updateOne({ $unset: { activeSession: 1} });
        await user.save()
        await sendWebhook(kyc)
        const config=await Configuration.findOne({_id:kyc.configId})
        return res.json({success:true,msg:'Kyc successful',redirectUrl:config.redirectUrl})
      }
    }
    else{
      console.log("spoofing detected")
      kyc.kycCompleted=true
      kyc.kycStatus=false
      kyc.kycMessage="Liveness couldnt be detected in the selfie"
      await kyc.save()
      await user.updateOne({ $unset: { activeSession: 1} });
      await user.save()
      await sendWebhook(kyc)
      const config=await Configuration.findOne({_id:kyc.configId})
      return res.json({success:false,msg:'Liveness couldnt be detected in the selfie',redirectUrl:config.redirectUrl})
    }
  } catch (err) {
    next(err);
  }
};