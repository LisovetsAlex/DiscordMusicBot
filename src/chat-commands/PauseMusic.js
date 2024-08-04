const getPauseMusicProps = require("./props/getPauseMusicProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");

/**
 * Pauses the music in the Boombox.
 *
 * @param {Object} message - The message object from Discord.
 * @param {Boolean} skipProps - Whether to skip checking for music properties.
 * @return {Void}
 */
function pauseMusic(message, skipProps) {
    if (!getPauseMusicProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no boombox that is turned on.");
    }
    boombox.pause();
}

module.exports = pauseMusic;
