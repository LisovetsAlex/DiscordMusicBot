const boomboxManager = require("../boombox-classes/BoomboxManager");
const getTurnUpVolumeProps = require("./props/getTurnUpVolumeProps");

/**
 * Increases the volume of the boombox associated with the given message's guild by 0.1.
 *
 * @param {Object} message - The message object containing information about the message.
 * @param {boolean} skipProps - Whether to skip checking the properties of the message.
 * @return {Promise<void>} - A promise that resolves when the volume is increased or an error message is sent.
 */
function turnUpVolume(message, skipProps) {
    if (!getTurnUpVolumeProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no boombox that is turned on.");
    }
    boombox.addVolume(0.1);
}

module.exports = turnUpVolume;
