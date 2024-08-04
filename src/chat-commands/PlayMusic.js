const getPlayMusicProps = require("./props/getPlayMusicProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");

/**
 * Plays music in the boombox.
 *
 * @param {Object} message - The message object from Discord.
 * @param {Boolean} skipProps - Whether to skip checking for music properties.
 * @return {Promise} A promise that resolves when the music is played.
 */
function playMusic(message, skipProps) {
    if (!getPlayMusicProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no boombox that is turned on.");
    }
    boombox.play();
}

module.exports = playMusic;
