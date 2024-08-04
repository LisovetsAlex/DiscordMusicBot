const boomboxManager = require("../boombox-classes/BoomboxManager");
const getTurnDownVolumeProps = require("./props/getTurnDownVolumeProps");

/**
 * Decreases the volume of the boombox in the specified guild by 0.1.
 *
 * @param {Message} message - The message object that triggered the function.
 * @param {boolean} skipProps - Optional. If true, skips the check for turn down volume props.
 * @return {Promise<void>} - A Promise that resolves when the volume is decreased.
 */
function turnDownVolume(message, skipProps) {
    if (!getTurnDownVolumeProps(message) && !skipProps) {
        return;
    }

    const boombox = boomboxManager.getBoombox(message.guild.id);
    if (!boombox) {
        return message.channel.send("There is no boombox that is turned on.");
    }
    boombox.addVolume(-0.1);
}

module.exports = turnDownVolume;
