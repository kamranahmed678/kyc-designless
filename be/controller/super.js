const Admin = require('./../models/admin')
const Company = require('./../models/company')
const Kyc = require('./../models/kyc')

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Admin.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $match: { superadmin: false , companyadmin: true}
            },
            {
                $sort: { createdAt: -1 } // Sort by createdAt field in descending order
            },
            {
                $project: {
                    firstname: 1,
                    lastname: 1,
                    email: 1,
                    isapproved: 1,
                    isdeleted: 1,
                    companyName: { $arrayElemAt: ["$company.companyName", 0] }
                }
            }
        ]);
        
        res.json({
            success: true,
            users: users
        })
    }
    catch (err) {
        next(err)
    }
  }

  exports.getKycCount = async (req, res, next) => {
    try {
      const all = await Kyc.countDocuments({});
      const complete = await Kyc.countDocuments({ kycCompleted: true });
      const success = await Kyc.countDocuments({ kycStatus: true });
      const failed = await Kyc.countDocuments({ kycStatus: false });
  
      const kycCounts = {
        all,
        complete,
        success,
        failed,
      };
  
      return res.json({
        success: true,
        kycCounts: kycCounts
    })
    } catch (err) {
      throw err;
    }
  };

  
exports.editApproval= async (req, res, next) => {
    try {
        const [_id] = Object.keys(req.body);
        
        const document = await Admin.findById(_id);
        if (!document) {
            console.log('User not found')
            return res.status(404).send({ error: 'User not found' });   
        }
        document.isapproved = !document.isapproved;
        if(document.isapproved===false && document.companyadmin===true){
            const users = await Admin.updateMany({ company: document.company }, { $set: { isapproved: false } });
        }
        await document.save();
        console.log('user updated successfully')
        return res.send({ message: 'User updated successfully' });
    }
    catch (error) {
        return res.status(500).send({ error: 'Something went wrong' });
    }
}

exports.deleteUser=async (req, res, next) => {
    try {
        const [_id] = Object.keys(req.body);
        console.log("deleteid",_id)
        
        const [{ company }] = await Admin.find({ _id: _id }).select('company companyadmin');
        
        if (!company) {
            console.log('Document not found')
            return res.status(404).send({ error: 'Document not found' });
        }
        const result = await Admin.updateOne({ _id: _id }, { $set: { isdeleted: true } });
        
        console.log('Document updated successfully ',result)
        return res.send({ message: 'Document updated successfully' });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Something went wrong' });
    }
}

exports.unDeleteUser = async (req, res, next) => {
    try {
      const [_id] = Object.keys(req.body)
      console.log(_id)
      const result = await Admin.updateOne({ _id: _id }, { $set: { isdeleted: false } });
      const [{ company, companyadmin ,isapproved}] = await Admin.find({ _id: _id }).select('company companyadmin isapproved');
      
      if (!company) {
          console.log('Document not found')
          return res.status(404).send({ error: 'Document not found' });
      }
      
      
      console.log('Document updated successfully ',result)
      return res.send({ message: 'Document updated successfully' });
  
    } catch (error) {
      return res.status(500).send({ error: 'Something went wrong' })
    }
  }