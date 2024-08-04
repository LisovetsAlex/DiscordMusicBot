const boomboxManager = require("../boombox-classes/BoomboxManager");
const getQueuePlaylistProps = require("./props/getQueuePlaylistProps");

/**
 * Queues a playlist for the given message.
 *
 * @param {Message} message - The message object.
 * @return {Promise<void>} - A promise that resolves when the playlist is queued.
 */
async function queuePlaylist(message) {
    const url = getQueuePlaylistProps(message).link;
    if (!url) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no Boombox that is turned on.");
    }

    const id = getPlaylistId(url);
    if (!id) {
        return message.channel.send("Playlist ID not found in URL.");
    }
    await boombox.queuePlaylist(id);
}

function getPlaylistId(url) {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);

    return match ? match[1] : null;
}

module.exports = queuePlaylist;
