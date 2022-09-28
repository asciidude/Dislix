const User = require('../models/User.model');

/**
 * Verify if the user has been banned
 * @param {Object} user 
 * @returns 
 */
module.exports.banned = (user) => {
    // Verify if their IP has been banned
    let banned = false;
    const userByIP = User.find({ ip_address: user.ip_address});
    
    for(const user in userByIP) {
        if(user.banned) {
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