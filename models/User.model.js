const { Schema, model } = require('mongoose');

const user = new Schema({
    // General user data
    discordId: String,
    
    username: String,
    discriminator: String,
    email: String,

    createdAt: Date,

    // Profile data
    avatar: String, // https://cdn.discordapp.com/avatars/<USER_ID>/<AVATAR_ID>.png
    banner: String,
    banner_color: String,
    servers: Array,
    servers_owned: Array,

    // Banned information
    banned: Boolean,
    ban_expires: Date,
    ip_address: String
});

module.exports = model('User', user);