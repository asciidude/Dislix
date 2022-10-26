const User = require('../models/User.model');

/**
 * Verify if the user has been banned by IP
 * @param {Object} user 
 * @returns 
 */
module.exports.banned = (user) => {
    let banned = false;
    const userByIP = User.find({ ip_address: user.ip_address});
    
    for(const user in userByIP) {
        if(user.banned && new Date(user.ban_expires) > new Date()) {
            banned = true;
            break;
        }
    }

    return banned;
}

/**
 * Verify if the user exists
 * @param {Object} user 
 * @returns 
 */
module.exports.exists = (user) => {
    // Verify if user exists
    const userByID = User.findById(req.user._id);
    if(userByID) return true;
    else return false;
}