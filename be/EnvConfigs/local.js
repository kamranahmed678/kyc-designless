    /** Configuration File
 **/

module.exports = {
    port: process.env.PORT || 5003,
    database: 'mongodb://127.0.0.1:27017/kyc-db1',
    jwt_secret: 'testinglocalsecret',
    jwt_expire_in: '24h',
    bcrypt_salt_rounds: 12,
    
}
