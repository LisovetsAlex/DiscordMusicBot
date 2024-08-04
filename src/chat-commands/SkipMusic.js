const getSkipMusicProps = require("./props/getSkipMusicProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");

/**
 * Skips the current song in the Boombox.
 *
 * @param {Object} message - The message object from Discord.
 * @param {Object} skipProps - Optional. Additional properties to skip.
 * @return {Promise<void>} A Promise that resolves when the song is skipped.
 */
async function skipMusic(message, skipProps) {
    if (!getSkipMusicProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no Boombox that is turned on.");
    }

    await boombox.playNextSong();
}

module.exports = skipMusic;
