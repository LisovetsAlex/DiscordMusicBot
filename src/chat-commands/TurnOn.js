const { joinVoiceChannel } = require("@discordjs/voice");
const Boombox = require("../boombox-classes/Boombox");
const getTurnOnProps = require("./props/getTurnOnProps");
const boomboxManager = require("../boombox-classes/BoomboxManager");
const createBoomboxEmbed = require("../utility/createBoomboxEmbed");

/**
 * Turns on the boombox for a given message's guild, allowing music to be played.
 *
 * @param {Object} message - The message object containing information about the message.
 * @param {boolean} skipProps - Whether to skip checking the properties of the message.
 * @return {Promise<void>} - A promise that resolves when the boombox is turned on or an error message is sent.
 */
async function turnOn(message, skipProps) {
    if (!getTurnOnProps(message) && !skipProps) {
        return;
    }

    if (!message.member.voice?.channel) {
        return message.channel.send(
            "How about you connect to a voice channel first?"
        );
    }

    if (boomboxManager.getBoombox(message.guild.id)) {
        return message.channel.send("Boombox already exists.");
    }

    joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
    });

    const boombox = new Boombox(message.guild.id);

    boomboxManager.addBoombox(boombox);
    boombox.turnOn();

    const sentMessage = await message.channel.send(createBoomboxEmbed(boombox));

    boombox.onQueued((self) => {
        sentMessage.edit(createBoomboxEmbed(self));
    });
    boombox.onSongStart((self) => {
        sentMessage.edit(createBoomboxEmbed(self));
    });
    boombox.onQueueEmpty((self) => {
        sentMessage.edit(createBoomboxEmbed(self));
    });
}

module.exports = turnOn;
