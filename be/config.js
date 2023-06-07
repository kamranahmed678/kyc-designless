const LocalConfig = require('./EnvConfigs/local')

function getConfig() {
    const env = process.env.NODE_ENV || 'local'
    console.log('NODE_ENV:', env.trim())
    switch (env.trim()) {
        case 'local':
            return LocalConfig
        default:
            return LocalConfig
    }
}

module.exports = getConfig()