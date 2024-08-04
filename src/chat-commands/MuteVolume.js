const boomboxManager = require("../boombox-classes/BoomboxManager");
const getMuteVolumeProps = require("./props/getMuteVolumeProps");

/**
 * Mutes the volume of the boombox associated with the given message's guild.
 *
 * @param {Object} message - The message object containing information about the message.
 * @param {boolean} skipProps - Whether to skip checking the properties of the message.
 * @return {Promise<void>} - A promise that resolves when the volume is muted or an error message is sent.
 */
function muteVolume(message, skipProps) {
    if (!getMuteVolumeProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no boombox that is turned on.");
    }
    boombox.muteVolume();
}

module.exports = muteVolume;
