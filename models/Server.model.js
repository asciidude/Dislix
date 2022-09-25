const { Schema, model } = require('mongoose');

// Get all of this from a bot
// /guilds/<GUILD_ID>
const server = new Schema({
    owner_id: String,
    poster: String, // ID

    server_id: String,
    server_name: String,
    server_region: String,

    server_icon: String, // https://cdn.discordapp.com/icons/<GUILD_ID>/<GUILD_ICON>.png
    server_banner: String, // https://cdn.discordapp.com/banners/<GUILD_ID>/<GUILD_BANNER>.png

    short_description: String,
    long_description: String,

    emojis: Array,
    roles: Array
});