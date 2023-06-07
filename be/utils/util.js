const File = require('../models/file')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const { exec } = require('child_process');

const {jwt_secret,jwt_expire_in } = require('../config')


exports.generateToken = (userId) => {
    const token = jwt.sign(
      {
        userId: userId,
      },
      jwt_secret,
      { expiresIn: jwt_expire_in }
    );
    return token;
  };

exports.uploadFile = async ({ kycId, fileData, fileType }) => {
    try {
        const currentTime = new Date().getTime();
        const fileName = `${fileType}_${currentTime}`;

        const existingFile = await File.findOne({ kycId, fileType });

        if (existingFile) {
            existingFile.fileName = fileName;
            existingFile.fileData = fileData;
            await existingFile.save();
            return existingFile._id;
        } else {
            const newFile = new File({
                kycId,
                fileName,
                fileData,
                fileType
            });
            await newFile.save();
            return newFile._id;
        }
    } catch (error) {
        throw new Error('File upload failed');
    }
};

exports.antispoof = () => {
    return new Promise((resolve, reject) => {
      const cmd = `python "C:\\newkyc\\be\\antispoofing\\Test.py" --image_name "C:\\newkyc\\be\\uploads\\selfie\\selfie.jpg"`;
      // const cmd = `python ".\\antispoofing\\Test.py" --image_name ".\\uploads\\selfie\\selfie.jpg"`;
    //   const cmd = `python3 "./antispoofing/Test.py" --image_name "./uploads/selfie/selfie.jpg"`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error: ${error.message}`));
        } else if (stderr) {
          reject(new Error(`stderr: ${stderr}`));
        } else {
          resolve(stdout.trim()); // remove any extra whitespace from the result
        }
      });
    });
  };
  
exports.faceRecognition =()=>{
    return new Promise((resolve, reject) => {
      const cmd = `face_recognition "C:\\newkyc\\be\\uploads\\selfie" "C:\\newkyc\\be\\uploads\\id"`;
      // face_recognition ".\\uploads\\selfie" ".\\uploads\\id"
      // const cmd=`face_recognition ".\\uploads\\selfie" ".\\uploads\\id"`;
    //   const cmd=`face_recognition "./uploads/selfie" "./uploads/id"`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Error: ${error.message}`));
        } else if (stderr) {
          reject(new Error(`stderr: ${stderr}`));
        } else {
          resolve(stdout.trim()); // remove any extra whitespace from the result
        }
      });
    });
  }

  exports.storeImages=async ({id,selfie})=>{
    try{
        const base64Data = id.fileData.replace(/^data:image\/jpeg;base64,/, '');
        const filename1 = 'id.jpg';
  
        fs.writeFile(`./uploads/id/${filename1}`, base64Data, 'base64', (err) => {
          if (err) {
            console.error(err);
            console.log("error saving image")
            return ({success:false,msg:'An Error occured while uploading the image'})
          }
          // Image saved successfully
          console.log('Image saved successfully')
        });
      }
      catch(e)
      {
        console.log(e)
      }
      try{
        const base64Data = selfie.fileData.replace(/^data:image\/png;base64,/, '');
        const filename1 = 'selfie.jpg';
  
        fs.writeFile(`./uploads/selfie/${filename1}`, base64Data, 'base64', (err) => {
          if (err) {
            console.error(err);
            console.log("error saving image")
            return ({success:false,msg:'An Error occured while uploading the image'})
          }
          // Image saved successfully
          console.log('Image saved successfully')
        });
      }
      catch(e)
      {
        console.log(e)
      }
      return ({success:true})
  }

  exports.generateAccessKey=()=> {
      let accessKey = '';
      for (let i = 0; i < 20; i++) {
        const randomNumber = Math.floor(Math.random() * 10);
        accessKey += randomNumber;
      }
      return accessKey;
    }