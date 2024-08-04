const getClearMusicProps = require("./props/getClearMusicProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");

/**
 * Clears the music queue of a Boombox in a guild.
 *
 * @param {Object} message - The message object.
 * @param {Object} skipProps - Optional. Additional properties to skip.
 * @return {Promise<void>} A Promise that resolves when the queue is cleared.
 */
async function clearMusic(message, skipProps) {
    if (!getClearMusicProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no Boombox that is turned on.");
    }

    await boombox.clearQueue();
}

module.exports = clearMusic;
