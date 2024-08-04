const getQueueMusicProps = require("./props/getQueueMusicProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");

/**
 * Queues a music song in a Boombox.
 *
 * @param {Object} message - The message object containing the song link.
 * @return {Promise<void>} A Promise that resolves when the song is queued.
 */
async function queueMusic(message) {
    const url = getQueueMusicProps(message).link;
    if (!url) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no Boombox that is turned on.");
    }

    await boombox.queueSong(url);
}

module.exports = queueMusic;
