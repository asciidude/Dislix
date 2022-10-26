const User = require('../models/User.model');

/**
 * Verify if the user exists
 * @param {Object} user 
 * @returns 
 */
 module.exports.exists = async (user) => {
    // Verify if user exists
    const userByID = await User.find({ discordId: user.discordId });
    if(userByID) return true;
    else return false;
}

/**
 * Verify if the user has been banned by IP
 * @param {Object} user 
 * @returns 
 */
module.exports.banned = async (user) => {
    let banned = false;
    const userByIP = await User.find({ ip_address: user.ip_address });
    
    for(const user in userByIP) {
        if(user.banned && new Date(user.ban_expires) > new Date()) {
            banned = true;
            break;
        }
    }

    return banned;
}