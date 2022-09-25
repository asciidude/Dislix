const { Schema, model } = require('mongoose');

const user = new Schema({
    // General user data
    username: String,
    tag: String,
    password: String,
    email: String,
    discordId: String,

    // Profile data
    avatar: String,
    /*banner: String,*/ // ?
    servers: Array,
    servers_in: Array, // check if Administrator permission is applied, then call API

    banned: Boolean,
    ip_address: String
});

